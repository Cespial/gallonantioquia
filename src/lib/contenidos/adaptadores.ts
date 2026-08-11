import type {
  Article,
  BlogPost,
  ColumnaArticle,
  Episode,
  GuestColumn,
  IdeaTopic,
} from "@/types";
import type { ContenidoConImagen } from "./consultas";

// Traducción entre lo que guarda la base y lo que esperan los componentes del
// sitio público, que ya existían y no cambian de forma. Todo campo que pueda
// venir nulo se resuelve aquí, para que ninguna pantalla tenga que decidir qué
// hacer con un resumen vacío o una portada sin asignar.

/** Reserva para el contenido que todavía no tiene portada propia. */
export const IMAGEN_POR_DEFECTO = "/images/gallon-retrato-obra-hd.jpg";

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor : "";
}

function imagen(c: ContenidoConImagen): string {
  return c.imagenUrl ?? IMAGEN_POR_DEFECTO;
}

export function aColumna(c: ContenidoConImagen): ColumnaArticle {
  return {
    slug: c.slug,
    title: c.titulo,
    excerpt: c.resumen ?? "",
    date: c.fecha,
    readTime: texto(c.extra.readTime),
    image: imagen(c),
    sourceUrl: texto(c.extra.sourceUrl),
    // El cuerpo ya no viaja como lista de párrafos: la página de detalle
    // recibe `cuerpoHtml`, que se sanitiza al guardar.
    body: [],
  };
}

export function aEntradaBitacora(c: ContenidoConImagen): BlogPost {
  return {
    slug: c.slug,
    title: c.titulo,
    excerpt: c.resumen ?? "",
    tag: c.categoria ?? "",
    date: c.fecha,
    readTime: texto(c.extra.readTime),
    image: imagen(c),
    content: c.cuerpoHtml ?? "",
  };
}

export function aHistoria(c: ContenidoConImagen): Article {
  const formato = texto(c.extra.format);

  return {
    slug: c.slug,
    title: c.titulo,
    excerpt: c.resumen ?? "",
    category: c.categoria ?? "",
    date: c.fecha,
    readTime: texto(c.extra.readTime),
    format: (formato || "texto") as Article["format"],
    image: imagen(c),
    featured: c.destacado,
  };
}

export function aIdea(c: ContenidoConImagen): IdeaTopic {
  return {
    slug: c.slug,
    number: texto(c.extra.number),
    title: c.titulo,
    description: c.resumen ?? "",
    content: c.cuerpoHtml ?? "",
  };
}

export function aEpisodio(c: ContenidoConImagen): Episode {
  return {
    number: Number(c.extra.number ?? 0),
    title: c.titulo,
    guest: texto(c.extra.guest),
    guestRole: texto(c.extra.guestRole),
    description: c.resumen ?? "",
    format: Array.isArray(c.extra.format) ? (c.extra.format as Episode["format"]) : [],
    image: imagen(c),
  };
}

export function aVoz(c: ContenidoConImagen): GuestColumn {
  return {
    slug: c.slug,
    authorName: texto(c.extra.authorName),
    authorRole: texto(c.extra.authorRole),
    authorCategory: texto(c.extra.authorCategory),
    authorImage: texto(c.extra.authorImage) || IMAGEN_POR_DEFECTO,
    title: c.titulo,
    excerpt: c.resumen ?? "",
    date: c.fecha,
    pullQuote: texto(c.extra.pullQuote),
  };
}
