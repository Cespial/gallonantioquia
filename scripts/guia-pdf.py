#!/usr/bin/env python3
"""Arma docs/guia-panel.pdf a partir de docs/guia-panel.md.

Cómo correrlo:

    python3 scripts/guia-pdf.py

Pasos: pandoc convierte el markdown a HTML con el CSS de impresión
(docs/guia-panel.css), Playwright abre ese HTML en Chromium y lo imprime a
PDF tamaño carta con pie de página numerado, y por último pdftoppm convierte
cada página del PDF final a un PNG en un directorio temporal, para hacer el
QA visual página por página a simple vista.

Requiere pandoc y poppler (pdftoppm) instalados en el sistema, y el paquete
de Python `playwright` con `python3 -m playwright install chromium` ya
corrido una vez.
"""

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent
MARKDOWN = RAIZ / "docs" / "guia-panel.md"
CSS = RAIZ / "docs" / "guia-panel.css"
PDF_SALIDA = RAIZ / "docs" / "guia-panel.pdf"

PIE_DE_PAGINA = (
    "<div style='font-size:8pt;color:#6b7a6b;width:100%;text-align:center;"
    "font-family:Helvetica,Arial'>Guía del panel · gallonantioquia.vercel.app/admin"
    " · página <span class='pageNumber'></span> de <span class='totalPages'></span></div>"
)


def main() -> None:
    with tempfile.TemporaryDirectory() as directorio_tmp:
        tmp = Path(directorio_tmp)
        html_salida = tmp / "guia-panel.html"

        subprocess.run(
            [
                "pandoc",
                str(MARKDOWN),
                "-s",
                "--metadata",
                'pagetitle="Guía del panel de administración"',
                "-c",
                "guia-panel.css",
                "-o",
                str(html_salida),
            ],
            check=True,
            cwd=RAIZ,
        )
        shutil.copy(CSS, tmp / "guia-panel.css")

        with sync_playwright() as p:
            navegador = p.chromium.launch()
            pagina = navegador.new_page()
            pagina.goto(f"file://{html_salida}")
            pagina.emulate_media(media="print")
            pagina.pdf(
                path=str(PDF_SALIDA),
                format="Letter",
                print_background=True,
                margin={"top": "22mm", "bottom": "22mm", "left": "20mm", "right": "20mm"},
                display_header_footer=True,
                header_template="<div></div>",
                footer_template=PIE_DE_PAGINA,
            )
            navegador.close()

        directorio_png = Path(tempfile.mkdtemp(prefix="guia-panel-png-"))
        subprocess.run(
            ["pdftoppm", "-r", "110", "-png", str(PDF_SALIDA), str(directorio_png / "pagina")],
            check=True,
        )

        paginas_png = sorted(directorio_png.glob("pagina*.png"))
        print(f"{len(paginas_png)} páginas en {PDF_SALIDA}")
        for ruta in paginas_png:
            print(ruta)


if __name__ == "__main__":
    sys.exit(main())
