import { describe, it, expect } from "vitest";
import { sanitizarHtml } from "@/lib/admin/sanitizar";

describe("sanitizarHtml", () => {
  it("conserva el formato que produce el editor", () => {
    const html =
      '<p>Un <strong>párrafo</strong> con <em>énfasis</em> y un <a href="https://alponiente.com/">enlace</a>.</p>' +
      "<h2>Un subtítulo</h2><blockquote><p>Una cita.</p></blockquote><ul><li>Uno</li></ul>";
    expect(sanitizarHtml(html)).toBe(
      '<p>Un <strong>párrafo</strong> con <em>énfasis</em> y un <a href="https://alponiente.com/" target="_blank" rel="noopener noreferrer nofollow">enlace</a>.</p>' +
        "<h2>Un subtítulo</h2><blockquote><p>Una cita.</p></blockquote><ul><li>Uno</li></ul>"
    );
  });

  it("elimina scripts", () => {
    expect(sanitizarHtml('<p>Hola</p><script>alert("x")</script>')).toBe("<p>Hola</p>");
  });

  it("elimina manejadores de eventos en línea", () => {
    expect(sanitizarHtml('<p onclick="robar()">Hola</p>')).toBe("<p>Hola</p>");
  });

  it("desactiva enlaces con javascript: quitándoles el href", () => {
    const limpio = sanitizarHtml('<a href="javascript:alert(1)">clic</a>');

    // Lo que importa: sin `href`, la etiqueta deja de ser un enlace y es inerte.
    expect(limpio).not.toContain("href");
    expect(limpio).not.toContain("javascript:");
    expect(limpio).toContain("clic");

    // `sanitize-html` aplica `transformTags` ANTES de filtrar atributos por
    // esquema, así que el `<a>` conserva `target` y `rel`. Es ruido de marcado
    // sin efecto: no hay destino al que ir.
    expect(limpio).toBe('<a target="_blank" rel="noopener noreferrer nofollow">clic</a>');
  });

  it("desactiva también enlaces con data: y vbscript:", () => {
    for (const esquema of ["data:text/html;base64,PHNjcmlwdD4=", "vbscript:msgbox(1)"]) {
      const limpio = sanitizarHtml(`<a href="${esquema}">clic</a>`);
      expect(limpio, `el esquema ${esquema} sobrevivió`).not.toContain("href");
    }
  });

  it("elimina iframes y objetos incrustados", () => {
    expect(sanitizarHtml('<p>a</p><iframe src="https://malo.co"></iframe>')).toBe("<p>a</p>");
  });

  it("no rompe con entrada vacía", () => {
    expect(sanitizarHtml("")).toBe("");
  });
});
