"""Verificación end-to-end del panel en producción.

Comprueba la promesa central del módulo: que publicar desde /admin se refleja
en el sitio público sin volver a desplegar.
"""
import os
import sys
from playwright.sync_api import sync_playwright

BASE = "https://gallonantioquia.vercel.app"
CORREO = os.environ.get("CORREO_ADMIN", "contacto@inplux.co")
CLAVE = os.environ.get("CLAVE_ADMIN", "")
import os
TOMAS = os.environ.get("CAPTURAS", "/tmp")


def paso(texto):
    print(f"\n=== {texto} ===", flush=True)


if not CLAVE:
    print("Falta la contraseña: CLAVE_ADMIN=... python3 scripts/verificar-panel.py")
    sys.exit(2)

with sync_playwright() as p:
    navegador = p.chromium.launch()
    pagina = navegador.new_page(viewport={"width": 1440, "height": 900})

    paso("1. Estado inicial de /bitacora en el sitio público")
    pagina.goto(f"{BASE}/bitacora", wait_until="domcontentloaded")
    antes = pagina.locator('a[href^="/bitacora/"]').count()
    print(f"entradas visibles antes: {antes}")

    paso("2. Entrar al panel")
    pagina.goto(f"{BASE}/admin", wait_until="networkidle")
    print("redirigió a:", pagina.url)
    # Sin esperar la hidratación, los campos se llenan pero el manejador de
    # React todavía no existe y el clic no envía nada.
    pagina.wait_for_selector('button[type="submit"]')
    pagina.wait_for_timeout(1500)
    pagina.fill("#email", CORREO)
    pagina.fill("#password", CLAVE)
    pagina.screenshot(path=f"{TOMAS}/panel-1-acceso.png")
    pagina.click('button[type="submit"]')
    # `router.push` navega del lado del cliente: no hay evento de carga que
    # esperar, así que se espera a que la barra lateral del panel exista.
    pagina.wait_for_selector('nav[aria-label="Secciones del panel"]', timeout=30000)
    print("entró a:", pagina.url)

    pagina.wait_for_load_state("networkidle")
    pagina.screenshot(path=f"{TOMAS}/panel-2-resumen.png", full_page=True)
    resumen = pagina.locator("main").last.inner_text()
    print("resumen del panel:\n" + resumen[:400])

    paso("3. Abrir la sección Bitácora")
    pagina.goto(f"{BASE}/admin/bitacora", wait_until="networkidle")
    pagina.screenshot(path=f"{TOMAS}/panel-3-listado.png", full_page=True)
    filas = pagina.locator("tbody tr")
    print("filas en el listado:", filas.count())
    primer_titulo = filas.nth(0).locator("td").nth(0).inner_text().split("\n")[0]
    print("primera entrada:", primer_titulo)

    paso("4. Publicar la primera entrada")
    boton = filas.nth(0).get_by_role("button", name="Publicar")
    if boton.count() == 0:
        print("ya estaba publicada; se salta")
    else:
        boton.first.click()
        pagina.wait_for_timeout(6000)
        estado = filas.nth(0).inner_text()
        print("estado tras publicar:", "Publicada" if "Publicada" in estado else estado[:120])
    pagina.screenshot(path=f"{TOMAS}/panel-4-publicado.png", full_page=True)

    paso("5. El sitio público, sin volver a desplegar")
    pagina.goto(f"{BASE}/bitacora", wait_until="networkidle")
    despues = pagina.locator('a[href^="/bitacora/"]').count()
    print(f"entradas visibles después: {despues}")
    pagina.screenshot(path=f"{TOMAS}/sitio-bitacora.png", full_page=True)

    paso("6. Devolver la entrada a borrador")
    pagina.goto(f"{BASE}/admin/bitacora", wait_until="networkidle")
    despublicar = pagina.locator("tbody tr").nth(0).get_by_role("button", name="Despublicar")
    if despublicar.count():
        despublicar.first.click()
        pagina.wait_for_timeout(5000)
        print("devuelta a borrador")

    pagina.goto(f"{BASE}/bitacora", wait_until="networkidle")
    final = pagina.locator('a[href^="/bitacora/"]').count()
    print(f"entradas visibles al final: {final}")

    navegador.close()

    print("\n---------- RESULTADO ----------")
    ok = antes == 0 and despues == 1 and final == 0
    print(f"antes={antes}  después de publicar={despues}  tras despublicar={final}")
    print("VERIFICADO: el cambio sale al aire sin desplegar" if ok else "REVISAR: no se comportó como se esperaba")
    sys.exit(0 if ok else 1)
