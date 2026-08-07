import { describe, it, expect } from "vitest";
import { generarSlug } from "@/lib/admin/slug";

describe("generarSlug", () => {
  it("pasa a minúsculas y une con guiones", () => {
    expect(generarSlug("Hacer lo impensable")).toBe("hacer-lo-impensable");
  });

  it("quita tildes y eñes", () => {
    expect(generarSlug("Puerto Pisisí, ahora sí")).toBe("puerto-pisisi-ahora-si");
    expect(generarSlug("Competitividad del oriente antioqueño")).toBe(
      "competitividad-del-oriente-antioqueno"
    );
  });

  it("quita signos de puntuación y de interrogación de apertura", () => {
    expect(generarSlug("¿Cómo crecer con tanta informalidad?")).toBe(
      "como-crecer-con-tanta-informalidad"
    );
  });

  it("colapsa espacios y guiones repetidos, y recorta los de los extremos", () => {
    expect(generarSlug("  Hidroituango —  El BOOMT-erang  ")).toBe(
      "hidroituango-el-boomt-erang"
    );
  });

  it("devuelve cadena vacía si no queda nada utilizable", () => {
    expect(generarSlug("¿¡—!?")).toBe("");
  });
});
