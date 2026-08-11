import { describe, it, expect } from "vitest";
import { TIPOS, LISTA_TIPOS, configPorRutaAdmin } from "@/lib/admin/tipos";
import { esquemaContenido } from "@/lib/admin/esquemas";

describe("configuración de tipos", () => {
  it("declara los nueve tipos", () => {
    expect(LISTA_TIPOS).toHaveLength(9);
    expect(LISTA_TIPOS.map((t) => t.tipo).sort()).toEqual([
      "bitacora",
      "columna",
      "eje",
      "episodio",
      "evento",
      "historia",
      "idea",
      "proyecto",
      "voz",
    ]);
  });

  it("resuelve las rutas de los tipos de campaña", () => {
    expect(configPorRutaAdmin("agenda")?.tipo).toBe("evento");
    expect(configPorRutaAdmin("ejes")?.tipo).toBe("eje");
    expect(configPorRutaAdmin("proyectos")?.tipo).toBe("proyecto");
  });

  it("la agenda ordena por fecha y el plan de gobierno por posición", () => {
    expect(TIPOS.evento.ordenPor).toBe("fecha");
    expect(TIPOS.eje.ordenPor).toBe("orden");
  });

  it("los proyectos se clasifican por la taxonomía del mockup", () => {
    expect(TIPOS.proyecto.taxonomia?.valores).toEqual([
      "Infraestructura",
      "Educación",
      "Campo",
      "Salud",
    ]);
  });

  it("resuelve la ruta del panel a su configuración", () => {
    expect(configPorRutaAdmin("columnas")?.tipo).toBe("columna");
    expect(configPorRutaAdmin("un-cafe")?.tipo).toBe("episodio");
    expect(configPorRutaAdmin("inventada")).toBeNull();
  });

  it("declara el plural de cada tipo, que no siempre es el singular con una ese", () => {
    // «columna invitada» pluraliza las dos palabras; concatenar una ese al
    // singular daría «columna invitadas» en el panel.
    expect(TIPOS.voz.plural).toBe("columnas invitadas");
    expect(TIPOS.columna.plural).toBe("columnas");
    expect(TIPOS.bitacora.plural).toBe("entradas");
    expect(TIPOS.episodio.plural).toBe("episodios");
    expect(LISTA_TIPOS.every((t) => t.plural.length > 0)).toBe(true);
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

  it("acepta un formato único en una historia y rechaza el arreglo", () => {
    const historia = {
      ...base,
      categoria: "Comunidades",
      extra: { readTime: "5 min", format: "texto" },
    };
    expect(esquemaContenido("historia").safeParse(historia).success).toBe(true);
    expect(
      esquemaContenido("historia").safeParse({ ...historia, extra: { readTime: "", format: ["texto"] } })
        .success
    ).toBe(false);
  });

  it("rechaza un formato de historia que no está en la lista", () => {
    const r = esquemaContenido("historia").safeParse({
      ...base,
      categoria: "Comunidades",
      extra: { readTime: "5 min", format: "infografia" },
    });
    expect(r.success).toBe(false);
  });

  it("exige el número en una idea y no admite taxonomía", () => {
    const idea = { ...base, categoria: null, extra: { number: "01" } };
    expect(esquemaContenido("idea").safeParse(idea).success).toBe(true);
    expect(
      esquemaContenido("idea").safeParse({ ...idea, extra: { number: "" } }).success
    ).toBe(false);
  });

  it("exige municipio, hora y lugar en un evento de la agenda", () => {
    const evento = {
      ...base,
      categoria: null,
      extra: {
        municipio: "Támesis",
        hora: "10:00 a. m.",
        lugar: "Parque Principal",
        enlaceInscripcion: "",
      },
    };
    expect(esquemaContenido("evento").safeParse(evento).success).toBe(true);
    expect(
      esquemaContenido("evento").safeParse({
        ...evento,
        extra: { ...evento.extra, municipio: "" },
      }).success
    ).toBe(false);
  });

  it("exige un icono de la lista en un eje del plan de gobierno", () => {
    const eje = { ...base, categoria: null, extra: { icono: "salud" } };
    expect(esquemaContenido("eje").safeParse(eje).success).toBe(true);
    expect(
      esquemaContenido("eje").safeParse({ ...eje, extra: { icono: "inventado" } }).success
    ).toBe(false);
  });

  it("acepta un proyecto de una categoría válida y rechaza otra", () => {
    const proyecto = { ...base, categoria: "Infraestructura", extra: {} };
    expect(esquemaContenido("proyecto").safeParse(proyecto).success).toBe(true);
    expect(
      esquemaContenido("proyecto").safeParse({ ...proyecto, categoria: "Turismo" }).success
    ).toBe(false);
  });

  it("exige nombre y cargo del autor en una voz", () => {
    const voz = {
      ...base,
      categoria: null,
      extra: { authorName: "Ana Restrepo", authorRole: "Alcaldesa", authorCategory: "", authorImage: "", pullQuote: "" },
    };
    expect(esquemaContenido("voz").safeParse(voz).success).toBe(true);
    expect(
      esquemaContenido("voz").safeParse({ ...voz, extra: { ...voz.extra, authorName: "" } }).success
    ).toBe(false);
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
