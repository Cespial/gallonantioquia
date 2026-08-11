import { describe, it, expect } from "vitest";
import type { ContenidoConImagen } from "@/lib/contenidos/consultas";
import {
  aColumna,
  aEntradaBitacora,
  aHistoria,
  aIdea,
  aEpisodio,
  aVoz,
  IMAGEN_POR_DEFECTO,
} from "@/lib/contenidos/adaptadores";

function contenido(parcial: Partial<ContenidoConImagen> = {}): ContenidoConImagen {
  return {
    id: "11111111-1111-1111-1111-111111111111",
    tipo: "columna",
    slug: "puerto-pisisi",
    titulo: "Puerto Pisisí",
    resumen: "Un resumen.",
    cuerpoHtml: "<p>Cuerpo.</p>",
    imagenId: null,
    fecha: "2026-01-10",
    categoria: "2026",
    estado: "publicado",
    destacado: false,
    orden: 0,
    extra: {},
    autorId: null,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
    eliminadoEn: null,
    imagenUrl: "/images/x.jpg",
    imagenAlt: "Una foto",
    ...parcial,
  } as ContenidoConImagen;
}

describe("adaptadores al sitio público", () => {
  it("traduce una columna con sus campos propios", () => {
    const r = aColumna(
      contenido({ extra: { sourceUrl: "https://alponiente.com/x/", readTime: "5 min" } })
    );

    expect(r).toMatchObject({
      slug: "puerto-pisisi",
      title: "Puerto Pisisí",
      excerpt: "Un resumen.",
      date: "2026-01-10",
      readTime: "5 min",
      image: "/images/x.jpg",
      sourceUrl: "https://alponiente.com/x/",
    });
  });

  it("nunca deja la imagen vacía: sin portada usa la de reserva", () => {
    const r = aColumna(contenido({ imagenUrl: null }));
    expect(r.image).toBe(IMAGEN_POR_DEFECTO);
  });

  it("tolera un resumen nulo sin romper el listado", () => {
    const r = aColumna(contenido({ resumen: null }));
    expect(r.excerpt).toBe("");
  });

  it("lleva la categoría de la bitácora al campo tag", () => {
    const r = aEntradaBitacora(contenido({ tipo: "bitacora", categoria: "Territorio" }));
    expect(r.tag).toBe("Territorio");
  });

  it("pasa el cuerpo de la bitácora como HTML", () => {
    const r = aEntradaBitacora(contenido({ tipo: "bitacora", cuerpoHtml: "<p>Hola</p>" }));
    expect(r.content).toBe("<p>Hola</p>");
  });

  it("una historia lleva formato y categoría", () => {
    const r = aHistoria(
      contenido({ tipo: "historia", categoria: "Comunidades", extra: { format: "video" } })
    );
    expect(r.category).toBe("Comunidades");
    expect(r.format).toBe("video");
  });

  it("una historia sin formato declarado cae en texto", () => {
    expect(aHistoria(contenido({ tipo: "historia", extra: {} })).format).toBe("texto");
  });

  it("una idea conserva su número", () => {
    const r = aIdea(contenido({ tipo: "idea", extra: { number: "03" } }));
    expect(r).toMatchObject({ number: "03", title: "Puerto Pisisí" });
  });

  it("un episodio devuelve el número como entero y los formatos como lista", () => {
    const r = aEpisodio(
      contenido({
        tipo: "episodio",
        extra: { number: 2, guest: "Ana", guestRole: "Alcaldesa", format: ["Video", "Podcast"] },
      })
    );
    expect(r.number).toBe(2);
    expect(r.guest).toBe("Ana");
    expect(r.format).toEqual(["Video", "Podcast"]);
  });

  it("un episodio sin formatos devuelve lista vacía, no undefined", () => {
    expect(aEpisodio(contenido({ tipo: "episodio", extra: {} })).format).toEqual([]);
  });

  it("una voz lleva los datos del autor invitado", () => {
    const r = aVoz(
      contenido({
        tipo: "voz",
        extra: {
          authorName: "Ana Restrepo",
          authorRole: "Alcaldesa",
          authorCategory: "Gobierno",
          authorImage: "/images/ana.jpg",
          pullQuote: "Una frase.",
        },
      })
    );

    expect(r).toMatchObject({
      authorName: "Ana Restrepo",
      authorRole: "Alcaldesa",
      authorCategory: "Gobierno",
      authorImage: "/images/ana.jpg",
      pullQuote: "Una frase.",
    });
  });
});
