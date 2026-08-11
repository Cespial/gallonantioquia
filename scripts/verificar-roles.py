"""Comprueba que un editor no alcanza las secciones de administrador."""
import os
import sys
from playwright.sync_api import sync_playwright

BASE = "https://gallonantioquia.vercel.app"
ADMIN = (os.environ.get("CORREO_ADMIN", "contacto@inplux.co"), os.environ.get("CLAVE_ADMIN", ""))
EDITOR = ("prueba-editor@inplux.co", "clave-de-prueba-2026-xy")


def entrar(pagina, correo, clave):
    pagina.goto(f"{BASE}/admin/login", wait_until="networkidle")
    pagina.wait_for_selector('button[type="submit"]')
    pagina.wait_for_timeout(1500)
    pagina.fill("#email", correo)
    pagina.fill("#password", clave)
    pagina.click('button[type="submit"]')
    pagina.wait_for_selector('nav[aria-label="Secciones del panel"]', timeout=30000)


if not ADMIN[1]:
    print("Falta la contraseña: CLAVE_ADMIN=... python3 scripts/verificar-roles.py")
    sys.exit(2)

with sync_playwright() as p:
    navegador = p.chromium.launch()
    fallos = []

    # --- Como administrador: crear el editor de prueba ---
    ctx_admin = navegador.new_context(viewport={"width": 1440, "height": 900})
    pg = ctx_admin.new_page()
    entrar(pg, *ADMIN)

    pg.goto(f"{BASE}/admin/usuarios", wait_until="networkidle")
    pg.wait_for_timeout(1500)
    print("admin ve /admin/usuarios:", pg.url.endswith("/admin/usuarios"))

    if EDITOR[0] not in pg.locator("body").inner_text():
        pg.fill("#nombre", "Editor de prueba")
        pg.fill("#email", EDITOR[0])
        pg.fill("#password", EDITOR[1])
        pg.select_option("#rol", "editor")
        pg.click('button:has-text("Crear cuenta")')
        pg.wait_for_timeout(6000)
        print("editor creado:", EDITOR[0] in pg.locator("body").inner_text())
    else:
        print("el editor ya existía")

    # --- Como editor: no debe alcanzar lo de administrador ---
    ctx_editor = navegador.new_context(viewport={"width": 1440, "height": 900})
    pe = ctx_editor.new_page()
    entrar(pe, *EDITOR)

    barra = pe.locator('nav[aria-label="Secciones del panel"]').inner_text()
    print("\nbarra lateral del editor:", barra.replace("\n", " · "))
    if "Usuarios" in barra or "Ajustes" in barra:
        fallos.append("la barra lateral del editor muestra secciones de administrador")

    for ruta in ["/admin/usuarios", "/admin/ajustes"]:
        pe.goto(f"{BASE}{ruta}", wait_until="networkidle")
        pe.wait_for_timeout(2000)
        llego = pe.url.rstrip("/").endswith(ruta)
        print(f"editor entrando a {ruta}: {'ENTRÓ (mal)' if llego else 'rebotado a ' + pe.url}")
        if llego:
            fallos.append(f"un editor alcanzó {ruta}")

    # El editor sí debe poder trabajar con contenido
    pe.goto(f"{BASE}/admin/bitacora", wait_until="networkidle")
    pe.wait_for_timeout(1500)
    puede = pe.locator("tbody tr").count() > 0
    print("editor sí ve el contenido de Bitácora:", puede)
    if not puede:
        fallos.append("el editor no puede ver el contenido, que sí es lo suyo")

    # --- Limpieza: desactivar la cuenta de prueba ---
    pg.goto(f"{BASE}/admin/usuarios", wait_until="networkidle")
    pg.wait_for_timeout(1500)
    fila = pg.locator("tbody tr", has_text=EDITOR[0])
    if fila.count():
        fila.first.get_by_role("button", name="Desactivar").click()
        pg.wait_for_timeout(5000)
        print("\ncuenta de prueba desactivada:", "Reactivar" in fila.first.inner_text())

    navegador.close()

    print("\n---------- RESULTADO ----------")
    if fallos:
        for f in fallos:
            print("FALLO:", f)
        sys.exit(1)
    print("VERIFICADO: el editor no alcanza Ajustes ni Usuarios")
