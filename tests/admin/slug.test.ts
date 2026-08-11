import { describe, it, expect } from "vitest";
import { generarSlug, LARGO_MAXIMO_SLUG } from "@/lib/admin/slug";
import { esquemaSlug } from "@/lib/admin/esquemas";

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

  it("recorta los títulos largos al límite que acepta esquemaSlug", () => {
    const titular =
      "Puerto Berrío inaugura una nueva planta de tratamiento de aguas residuales " +
      "en el corregimiento de Cristales tras dos años de retrasos en la obra";
    const slug = generarSlug(titular);

    expect(slug.length).toBeLessThanOrEqual(LARGO_MAXIMO_SLUG);
    expect(esquemaSlug.safeParse(slug).success).toBe(true);
  });

  it("no parte una palabra ni deja un guion colgando al recortar", () => {
    const slug = generarSlug("palabra ".repeat(40));

    expect(slug.endsWith("-")).toBe(false);
    expect(slug.split("-").every((p) => p === "palabra")).toBe(true);
  });

  it("corta en seco si una sola palabra ya pasa del límite", () => {
    const slug = generarSlug("a".repeat(200));

    expect(slug).toBe("a".repeat(LARGO_MAXIMO_SLUG));
    expect(esquemaSlug.safeParse(slug).success).toBe(true);
  });
});
