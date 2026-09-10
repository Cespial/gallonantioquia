"""Verificación de entrega del panel, de punta a punta y contra producción.

Recorre lo que el equipo de campaña va a hacer de verdad: entrar, subir una
foto, publicar y despublicar una columna, guardar Ajustes, recibir una
propuesta del formulario público, y comprobar que un editor no alcanza lo de
administrador. Todo lo que crea lo borra al final.

    CORREO_ADMIN=… CLAVE_ADMIN=… python3 scripts/verificar-entrega.py

Reemplaza a verificar-panel.py y verificar-roles.py, que apuntaban a la
Bitácora (retirada) y suponían que un editor no entra a Ajustes (hoy entra y
ve dos pestañas).
"""
import io, os, re, sys, time
from playwright.sync_api import sync_playwright

BASE = "https://gallonantioquia.vercel.app"
ADMIN = (os.environ.get("CORREO_ADMIN", "contacto@inplux.co"), os.environ.get("CLAVE_ADMIN", ""))
EDITOR = ("prueba-editor@inplux.co", os.environ.get("CLAVE_EDITOR", "clave-de-prueba-2026-xy"))
TOMAS = os.environ.get("CAPTURAS", "/tmp")
MARCA = "PRUEBA DE ENTREGA — borrar"
fallos: list[str] = []

def paso(t): print(f"\n=== {t} ===", flush=True)
def ok(cond, msg):
    print(("  ✓ " if cond else "  ✗ ") + msg, flush=True)
    if not cond: fallos.append(msg)
    return cond

def entrar(pg, correo, clave):
    pg.goto(f"{BASE}/admin/login", wait_until="networkidle")
    pg.wait_for_selector("#password"); pg.wait_for_timeout(800)
    pg.fill("#email", correo); pg.fill("#password", clave)
    pg.click('button[type="submit"]')
    try:
        pg.wait_for_selector('nav[aria-label="Secciones del panel"], h1:has-text("Estrena tu contraseña")', timeout=30000)
        return True
    except Exception:
        return False

def confirmar_inline(scope):
    """Los borrados piden confirmación en línea: un segundo botón junto al primero."""
    for patron in ("Sí, borrar", "Borrar definitivamente", "Confirmar", "Sí"):
        b = scope.get_by_role("button", name=re.compile(f"^{patron}", re.I))
        if b.count(): b.first.click(); return True
    return False

def png_de_prueba():
    from PIL import Image, ImageDraw
    im = Image.new("RGB", (900, 600), (29, 54, 31)); d = ImageDraw.Draw(im)
    d.rectangle((40, 40, 860, 560), outline=(217, 162, 27), width=6); d.text((80, 270), MARCA, fill=(255, 255, 255))
    buf = io.BytesIO(); im.save(buf, "PNG"); return buf.getvalue()

if not ADMIN[1]:
    print("Falta la contraseña: CORREO_ADMIN=… CLAVE_ADMIN=… python3 scripts/verificar-entrega.py"); sys.exit(2)

with sync_playwright() as p:
    nav = p.chromium.launch()
    ctx = nav.new_context(viewport={"width": 1440, "height": 900}); pg = ctx.new_page()

    paso("1. Entrar como administrador")
    ok(entrar(pg, *ADMIN), "el administrador entra al panel")
    barra = pg.locator('nav[aria-label="Secciones del panel"]')
    ok("Usuarios" in barra.inner_text() and "Ajustes" in barra.inner_text(), "la barra lateral del admin trae Usuarios y Ajustes")
    ruta_columnas = barra.get_by_role("link", name="Huellas en Antioquia").get_attribute("href")
    print("  ruta de columnas:", ruta_columnas)

    paso("2. Subir una foto al Blob y borrarla")
    pg.goto(f"{BASE}/admin/medios", wait_until="networkidle")
    antes = pg.locator("img").count()
    pg.set_input_files('input[type="file"]', {"name": "prueba-entrega.png", "mimeType": "image/png", "buffer": png_de_prueba()})
    # La subida anota la fila y refresca sola; sin recargar a mano debe verse.
    try:
        pg.wait_for_selector('img[src*="prueba-entrega"]', timeout=60000)
    except Exception: pass
    nueva = pg.locator('img[src*="prueba-entrega"]').first
    ok(nueva.count() > 0 and "blob.vercel-storage.com" in (nueva.get_attribute("src") or ""), "la foto aparece en la lista sin recargar, servida desde Vercel Blob")
    tarjeta = nueva.locator("xpath=ancestor::*[.//input or .//textarea][1]")
    campo = tarjeta.locator('[placeholder="Qué se ve en la foto"]').first
    if campo.count():
        campo.fill(MARCA); campo.blur(); pg.wait_for_timeout(2500)
        pg.reload(wait_until="networkidle")
        ok(pg.locator('[placeholder="Qué se ve en la foto"]').evaluate_all(f"els => els.some(e => e.value === {MARCA!r})"), "la descripción se guardó al salir del campo")
    pg.screenshot(path=f"{TOMAS}/entrega-2-foto.png", full_page=True)
    tarjeta = pg.locator('img[src*="prueba-entrega"]').first.locator("xpath=ancestor::*[.//button][1]")
    tarjeta.get_by_role("button", name="Borrar").first.click(); pg.wait_for_timeout(800); confirmar_inline(tarjeta); pg.wait_for_timeout(3000)
    pg.reload(wait_until="networkidle")
    ok(pg.locator('img[src*="prueba-entrega"]').count() == 0, "la foto de prueba se borró (fila y archivo)")

    paso("3. Crear, publicar, despublicar y borrar una columna")
    pg.goto(f"{BASE}{ruta_columnas}/nuevo", wait_until="networkidle")
    pg.fill("#titulo", MARCA); pg.wait_for_timeout(600)
    slug = pg.input_value("#slug"); print("  slug generado:", slug)
    pg.fill("#resumen", "Columna de prueba de la entrega del panel. Se borra al terminar.")
    if pg.locator("#fecha").count(): pg.fill("#fecha", time.strftime("%Y-%m-%d"))
    if pg.locator("#categoria").count():
        try: pg.select_option("#categoria", index=1)
        except Exception: pass
    editor = pg.locator(".ProseMirror").first
    editor.click(); editor.type("Cuerpo de la columna de prueba. Este texto no es real.")
    pg.get_by_role("button", name="Guardar borrador").click(); pg.wait_for_timeout(4000)
    ok(pg.locator("body").inner_text().count("error") == 0, "guardar borrador no arrojó error")
    pg.goto(f"{BASE}{ruta_columnas}", wait_until="networkidle")
    fila = pg.locator("tbody tr", has_text=MARCA)
    ok(fila.count() > 0, "la columna aparece en el listado como borrador")
    publico = ctx.new_page(); r = publico.goto(f"{BASE}/columnas/{slug}", wait_until="domcontentloaded")
    ok(r.status == 404, f"en borrador, /columnas/{slug} responde 404 (dio {r.status})")
    fila.first.get_by_role("button", name="Publicar").first.click(); pg.wait_for_timeout(6000)
    r = publico.goto(f"{BASE}/columnas/{slug}", wait_until="domcontentloaded")
    ok(r.status == 200 and MARCA in publico.content(), f"publicada, /columnas/{slug} responde 200 y trae el título")
    publico.goto(f"{BASE}/", wait_until="networkidle")
    ok(MARCA in publico.content(), "la portada (franja Blog) ya muestra la columna nueva")
    pg.reload(wait_until="networkidle"); fila = pg.locator("tbody tr", has_text=MARCA)
    fila.first.get_by_role("button", name="Despublicar").first.click(); pg.wait_for_timeout(6000)
    r = publico.goto(f"{BASE}/columnas/{slug}", wait_until="domcontentloaded")
    ok(r.status == 404, f"despublicada, /columnas/{slug} vuelve a 404 (dio {r.status})")
    pg.reload(wait_until="networkidle"); fila = pg.locator("tbody tr", has_text=MARCA)
    fila.first.get_by_role("button", name="Borrar").first.click(); pg.wait_for_timeout(800); confirmar_inline(fila.first); pg.wait_for_timeout(4000)
    pg.reload(wait_until="networkidle")
    ok(pg.locator("tbody tr", has_text=MARCA).count() == 0, "la columna se fue a la papelera")
    pg.goto(f"{BASE}/admin/papelera", wait_until="networkidle")
    ok(MARCA in pg.locator("body").inner_text(), "y aparece en la Papelera")

    paso("4. Guardar en Ajustes (pestaña Campaña, sin cambios)")
    pg.goto(f"{BASE}/admin/ajustes", wait_until="networkidle")
    # Las pestañas son <button role="tab">: get_by_role("button") no las ve.
    pg.locator('[role="tab"]:has-text("Campaña"), button:has-text("Campaña")').first.click(); pg.wait_for_timeout(800)
    pg.locator('button:has-text("Guardar")').first.click(); pg.wait_for_timeout(5000)
    ok("Guardado" in pg.locator("body").inner_text(), "Ajustes confirma «Guardado. El sitio ya muestra el cambio.»")

    paso("5. Una propuesta del formulario público llega a Propuestas")
    publico.goto(f"{BASE}/contacto", wait_until="networkidle")
    publico.fill('input[name="nombre"]', MARCA); publico.fill('input[name="email"]', "qa-entrega@inplux.co")
    if publico.locator('input[name="telefono"]').count(): publico.fill('input[name="telefono"]', "3000000000")
    publico.select_option('select[name="municipio"]', index=1)
    publico.fill('textarea[name="mensaje"]', "Propuesta de prueba de la entrega. Se borra al terminar.")
    publico.click('button:has-text("Enviar")'); publico.wait_for_timeout(3500)
    ok("recibimos tu propuesta" in publico.locator("body").inner_text().lower(), "el formulario público confirma el envío")
    pg.goto(f"{BASE}/admin/mensajes", wait_until="networkidle")
    fila = pg.locator("tbody tr, li, article", has_text=MARCA)
    ok(fila.count() > 0, "la propuesta aparece en Propuestas")
    fila.first.get_by_role("button", name=re.compile("Marcar como leída")).first.click(); pg.wait_for_timeout(3000)
    pg.reload(wait_until="networkidle"); fila = pg.locator("tbody tr, li, article", has_text=MARCA)
    ok(fila.first.get_by_role("button", name=re.compile("Marcar sin leer")).count() > 0, "se marcó como leída")
    fila.first.get_by_role("button", name="Borrar").first.click(); pg.wait_for_timeout(800); confirmar_inline(fila.first); pg.wait_for_timeout(3000)
    pg.reload(wait_until="networkidle")
    ok(pg.locator("tbody tr, li, article", has_text=MARCA).count() == 0, "la propuesta de prueba se borró")

    paso("6. Un editor ve lo suyo y no lo del administrador")
    pg.goto(f"{BASE}/admin/usuarios", wait_until="networkidle")
    fila = pg.locator("tbody tr", has_text=EDITOR[0])
    ok(fila.count() > 0, "existe la cuenta de editor de prueba")
    if fila.first.get_by_role("button", name="Reactivar").count():
        fila.first.get_by_role("button", name="Reactivar").click(); pg.wait_for_timeout(4000); print("  editor reactivado")
    ctx_e = nav.new_context(viewport={"width": 1440, "height": 900}); pe = ctx_e.new_page()
    clave_editor = EDITOR[1]
    if not entrar(pe, EDITOR[0], clave_editor):
        print("  la clave conocida no sirve: se restablece desde Usuarios")
        pg.reload(wait_until="networkidle"); fila = pg.locator("tbody tr", has_text=EDITOR[0])
        fila.first.get_by_role("button", name="Restablecer").click(); pg.wait_for_timeout(800)
        clave_editor = "temporal-editor-2026"
        fila.first.locator('input[type="password"], input[type="text"]').last.fill(clave_editor)
        fila.first.get_by_role("button", name=re.compile("Guardar|Restablecer|Aplicar")).last.click(); pg.wait_for_timeout(4000)
        ok(entrar(pe, EDITOR[0], clave_editor), "el editor entra con la clave temporal")
    if pe.locator('h1:has-text("Estrena tu contraseña")').count():
        pe.fill('input[name="actual"]', clave_editor); pe.fill('input[name="nueva"]', "editor-prueba-2026-ok"); pe.fill('input[name="repetida"]', "editor-prueba-2026-ok")
        pe.locator('form:has(input[name="nueva"]) button[type="submit"]').click(); pe.wait_for_timeout(3000)
        ok(pe.locator('nav[aria-label="Secciones del panel"]').count() > 0, "el editor estrena su contraseña y el panel se abre")
    barra_e = pe.locator('nav[aria-label="Secciones del panel"]').inner_text()
    ok("Usuarios" not in barra_e, "la barra lateral del editor no muestra Usuarios")
    pe.goto(f"{BASE}/admin/usuarios", wait_until="networkidle"); pe.wait_for_timeout(1500)
    ok(not pe.url.rstrip("/").endswith("/admin/usuarios"), f"el editor no alcanza /admin/usuarios (rebotado a {pe.url.replace(BASE,'')})")
    pe.goto(f"{BASE}/admin/ajustes", wait_until="networkidle"); pe.wait_for_timeout(1000)
    pestanas = [t for t in pe.locator("button").all_inner_texts() if t.strip() in ("Estado del sitio","Portada","Sobre mí","Menú del sitio","Campaña","Contacto y redes")]
    ok(sorted(pestanas) == ["Campaña", "Contacto y redes"], f"en Ajustes el editor ve solo Campaña y Contacto y redes (vio {pestanas})")
    pe.goto(f"{BASE}{ruta_columnas}", wait_until="networkidle")
    ok(pe.locator("tbody tr").count() > 0, "el editor sí ve las columnas")
    pg.goto(f"{BASE}/admin/usuarios", wait_until="networkidle"); fila = pg.locator("tbody tr", has_text=EDITOR[0])
    fila.first.get_by_role("button", name="Desactivar").click(); pg.wait_for_timeout(4000)
    pg.reload(wait_until="networkidle")
    ok(pg.locator("tbody tr", has_text=EDITOR[0]).first.get_by_role("button", name="Reactivar").count() > 0, "el editor de prueba quedó desactivado")
    pg.screenshot(path=f"{TOMAS}/entrega-6-usuarios.png", full_page=True)
    nav.close()

print("\n---------- RESULTADO ----------")
for f in fallos: print("FALLO:", f)
print("VERIFICADO: el panel se puede entregar" if not fallos else f"REVISAR: {len(fallos)} comprobaciones fallaron")
sys.exit(1 if fallos else 0)
