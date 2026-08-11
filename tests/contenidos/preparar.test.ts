import { describe, it, expect } from "vitest";
import { prepararFila } from "@/lib/contenidos/operaciones";

const FORM = {
  slug: "",
  titulo: "Puerto Pisisí, ahora sí",
  resumen: "Un resumen.",
  cuerpoHtml: '<p>Cuerpo</p><script>alert(1)</script>',
  fecha: "2026-01-10",
  categoria: "2026",
  estado: "publicado",
  destacado: "false",
  orden: "0",
  imagenId: "",
  extra: JSON.stringify({ sourceUrl: "https://alponiente.com/x/", readTime: "5 min" }),
};

describe("prepararFila", () => {
  it("genera el slug desde el título cuando viene vacío", () => {
    const r = prepararFila("columna", FORM);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.fila.slug).toBe("puerto-pisisi-ahora-si");
  });

  it("sanitiza el cuerpo antes de guardar", () => {
    const r = prepararFila("columna", FORM);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.fila.cuerpoHtml).toBe("<p>Cuerpo</p>");
      expect(r.fila.cuerpoHtml).not.toContain("script");
    }
  });

  it("convierte imagenId vacío en null en vez de cadena vacía", () => {
    const r = prepararFila("columna", FORM);
    if (r.ok) expect(r.fila.imagenId).toBeNull();
  });

  it("devuelve errores por campo cuando la validación falla", () => {
    const r = prepararFila("columna", { ...FORM, titulo: "", fecha: "10/01/2026" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errores).toHaveProperty("titulo");
      expect(r.errores).toHaveProperty("fecha");
    }
  });

  it("rechaza una categoría fuera de la taxonomía", () => {
    const r = prepararFila("columna", { ...FORM, categoria: "1999" });
    expect(r.ok).toBe(false);
  });
});
