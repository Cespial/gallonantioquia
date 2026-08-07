import { sql } from "drizzle-orm";
import { contenidos, medios, ajustes } from "@/db/esquema";
import type { TipoContenido } from "./tipos";
import { generarSlug } from "./slug";
import { sanitizarHtml } from "./sanitizar";

import { columnas } from "@/data/columnas";
import { columnasBodies } from "@/data/columnas-bodies";
import {
  blogPosts,
  stories,
  ideas,
  guestColumns,
  episodes,
  impactStats,
  timelineEvents,
  navItems,
  featuredReflection,
} from "@/data/content";

export interface ResumenMigracion {
  medios: number;
  porTipo: Record<TipoContenido, number>;
  ajustes: number;
}

function parrafosAHtml(parrafos: string[]): string {
  return sanitizarHtml(parrafos.map((p) => `<p>${p.trim()}</p>`).join(""));
}

/** Reúne todas las rutas /images/ que aparecen en los datos actuales. */
function recolectarImagenes(): string[] {
  const rutas = new Set<string>();
  const agregar = (v: unknown) => {
    if (typeof v === "string" && v.startsWith("/images/")) rutas.add(v);
  };

  columnas.forEach((c) => agregar(c.image));
  blogPosts.forEach((b) => agregar(b.image));
  stories.forEach((s) => agregar(s.image));
  guestColumns.forEach((g) => agregar(g.authorImage));
  episodes.forEach((e) => agregar(e.image));
  agregar(featuredReflection.image);
  // Portada de respaldo para los tipos que no traen imagen propia.
  agregar("/images/gallon-retrato-obra-hd.jpg");

  return Array.from(rutas);
}

function nombreDesdeRuta(ruta: string): string {
  return ruta.split("/").pop() ?? ruta;
}

export async function migrarContenido(db: any): Promise<ResumenMigracion> {
  return db.transaction(async (tx: any) => {
    // ---- Medios --------------------------------------------------------
    const rutas = recolectarImagenes();
    for (const url of rutas) {
      await tx
        .insert(medios)
        .values({ url, nombre: nombreDesdeRuta(url), alt: "" })
        .onConflictDoNothing();
    }
    const filasMedios = await tx.select().from(medios);
    const idPorUrl = new Map<string, string>(filasMedios.map((m: any) => [m.url, m.id]));
    const respaldo = idPorUrl.get("/images/gallon-retrato-obra-hd.jpg")!;
    const idDe = (ruta?: string) => (ruta && idPorUrl.get(ruta)) || respaldo;

    // ---- Contenidos ----------------------------------------------------
    const filas: any[] = [];

    columnas.forEach((c) => {
      filas.push({
        tipo: "columna",
        slug: c.slug,
        titulo: c.title,
        resumen: c.excerpt,
        cuerpoHtml: parrafosAHtml(columnasBodies[c.slug] ?? c.body ?? []),
        imagenId: idDe(c.image),
        fecha: c.date,
        categoria: c.date.slice(0, 4),
        estado: "publicado",
        extra: { sourceUrl: c.sourceUrl ?? "", readTime: c.readTime ?? "" },
      });
    });

    blogPosts.forEach((b) => {
      filas.push({
        tipo: "bitacora",
        slug: b.slug,
        titulo: b.title,
        resumen: b.excerpt,
        cuerpoHtml: b.content ? parrafosAHtml([b.content]) : null,
        imagenId: idDe(b.image),
        fecha: b.date,
        categoria: b.tag,
        estado: "borrador",
        extra: { readTime: b.readTime ?? "" },
      });
    });

    stories.forEach((s) => {
      filas.push({
        tipo: "historia",
        slug: s.slug,
        titulo: s.title,
        resumen: s.excerpt,
        cuerpoHtml: null,
        imagenId: idDe(s.image),
        fecha: s.date,
        categoria: s.category,
        estado: "borrador",
        extra: { readTime: s.readTime ?? "", format: s.format },
      });
    });

    ideas.forEach((i, indice) => {
      filas.push({
        tipo: "idea",
        slug: i.slug,
        titulo: i.title,
        resumen: i.description,
        cuerpoHtml: i.content ? parrafosAHtml([i.content]) : null,
        imagenId: respaldo,
        fecha: "2026-01-01",
        categoria: null,
        estado: "borrador",
        orden: indice,
        extra: { number: i.number },
      });
    });

    guestColumns.forEach((g) => {
      filas.push({
        tipo: "voz",
        slug: g.slug,
        titulo: g.title,
        resumen: g.excerpt,
        cuerpoHtml: null,
        imagenId: respaldo,
        fecha: g.date,
        categoria: null,
        estado: "borrador",
        extra: {
          authorName: g.authorName,
          authorRole: g.authorRole,
          authorCategory: g.authorCategory ?? "",
          authorImage: g.authorImage ?? "",
          pullQuote: g.pullQuote ?? "",
        },
      });
    });

    episodes.forEach((e, indice) => {
      filas.push({
        tipo: "episodio",
        slug: generarSlug(`${e.number}-${e.title}`),
        titulo: e.title,
        resumen: e.description,
        cuerpoHtml: null,
        imagenId: idDe(e.image),
        fecha: "2026-01-01",
        categoria: null,
        estado: "borrador",
        orden: indice,
        extra: {
          number: e.number,
          guest: e.guest,
          guestRole: e.guestRole,
          format: e.format,
        },
      });
    });

    for (const fila of filas) {
      await tx.insert(contenidos).values(fila).onConflictDoNothing();
    }

    // ---- Ajustes -------------------------------------------------------
    const valoresAjustes: Array<{ clave: string; valor: unknown }> = [
      { clave: "sitio.enConstruccion", valor: true },
      {
        clave: "sitio.mensajeConstruccion",
        valor: "Estamos preparando este espacio. Vuelve pronto.",
      },
      {
        clave: "portada.cifras",
        valor: impactStats.map((s) => ({ valor: s.value, sufijo: s.suffix, etiqueta: s.label })),
      },
      // `ajustes.valor` es jsonb NOT NULL: un JS `null` se traduce a SQL NULL
      // y viola la restricción. El literal jsonb 'null' sí es un valor válido
      // y representa "todavía no hay reflexión destacada elegida".
      { clave: "portada.reflexionDestacada", valor: sql`'null'::jsonb` },
      { clave: "portada.franjaFotos", valor: [] },
      {
        clave: "sobre.trayectoria",
        valor: timelineEvents.map((t) => ({ anio: t.year, titulo: t.title, descripcion: t.description })),
      },
      {
        clave: "navegacion.menu",
        valor: navItems.map((n) => ({ etiqueta: n.label, destino: n.href, visible: true })),
      },
      { clave: "navegacion.redes", valor: { x: "", instagram: "", youtube: "" } },
    ];

    for (const a of valoresAjustes) {
      await tx.insert(ajustes).values(a).onConflictDoNothing();
    }

    const porTipo = {} as Record<TipoContenido, number>;
    for (const f of filas) {
      porTipo[f.tipo as TipoContenido] = (porTipo[f.tipo as TipoContenido] ?? 0) + 1;
    }

    return { medios: rutas.length, porTipo, ajustes: valoresAjustes.length };
  });
}
