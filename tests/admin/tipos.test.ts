import { describe, it, expect } from "vitest";
import { TIPOS, LISTA_TIPOS, configPorRutaAdmin } from "@/lib/admin/tipos";
import { esquemaContenido } from "@/lib/admin/esquemas";

describe("configuración de tipos", () => {
  it("declara los seis tipos", () => {
    expect(LISTA_TIPOS).toHaveLength(6);
    expect(LISTA_TIPOS.map((t) => t.tipo).sort()).toEqual(
      ["bitacora", "columna", "episodio", "historia", "idea", "voz"]
    );
  });

  it("resuelve la ruta del panel a su configuración", () => {
    expect(configPorRutaAdmin("columnas")?.tipo).toBe("columna");
    expect(configPorRutaAdmin("un-cafe")?.tipo).toBe("episodio");
    expect(configPorRutaAdmin("inventada")).toBeNull();
  });

  it("ordena ideas y episodios por orden, el resto por fecha", () => {
    expect(TIPOS.idea.ordenPor).toBe("orden");
    expect(TIPOS.episodio.ordenPor).toBe("orden");
    expect(TIPOS.columna.ordenPor).toBe("fecha");
    expect(TIPOS.bitacora.ordenPor).toBe("fecha");
  });

  it("solo columna, bitacora e historia tienen taxonomía", () => {
    expect(TIPOS.columna.taxonomia).not.toBeNull();
    expect(TIPOS.bitacora.taxonomia?.valores).toContain("Liderazgo");
    expect(TIPOS.historia.taxonomia?.valores).toContain("Comunidades");
    expect(TIPOS.idea.taxonomia).toBeNull();
    expect(TIPOS.voz.taxonomia).toBeNull();
    expect(TIPOS.episodio.taxonomia).toBeNull();
  });
});

describe("validación por tipo", () => {
  const base = {
    slug: "puerto-pisisi",
    titulo: "Puerto Pisisí, ahora sí",
    resumen: "Un resumen.",
    cuerpoHtml: "<p>Cuerpo.</p>",
    fecha: "2026-01-10",
    estado: "borrador" as const,
    destacado: false,
    orden: 0,
    categoria: "2026",
    imagenId: null,
  };

  it("acepta una columna con sourceUrl válido", () => {
    const r = esquemaContenido("columna").safeParse({
      ...base,
      extra: { sourceUrl: "https://alponiente.com/x/", readTime: "5 min" },
    });
    expect(r.success).toBe(true);
  });

  it("rechaza una columna con sourceUrl que no es URL", () => {
    const r = esquemaContenido("columna").safeParse({
      ...base,
      extra: { sourceUrl: "no-es-url", readTime: "5 min" },
    });
    expect(r.success).toBe(false);
  });

  it("acepta sourceUrl vacío, porque no toda columna tiene original en línea", () => {
    const r = esquemaContenido("columna").safeParse({
      ...base,
      extra: { sourceUrl: "", readTime: "5 min" },
    });
    expect(r.success).toBe(true);
  });

  it("exige el nombre del invitado en un episodio", () => {
    const r = esquemaContenido("episodio").safeParse({
      ...base,
      categoria: null,
      extra: { number: 1, guest: "", guestRole: "Alcaldesa", format: ["Video"] },
    });
    expect(r.success).toBe(false);
  });

  it("rechaza un slug con mayúsculas o tildes", () => {
    const r = esquemaContenido("bitacora").safeParse({
      ...base,
      slug: "Puerto-Pisisí",
      categoria: "Territorio",
      extra: { readTime: "5 min" },
    });
    expect(r.success).toBe(false);
  });

  it("rechaza una categoría que no está en la taxonomía del tipo", () => {
    const r = esquemaContenido("bitacora").safeParse({
      ...base,
      categoria: "Inventada",
      extra: { readTime: "5 min" },
    });
    expect(r.success).toBe(false);
  });
});
