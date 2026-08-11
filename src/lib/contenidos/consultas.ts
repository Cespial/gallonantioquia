import { and, asc, desc, eq, isNotNull, isNull } from "drizzle-orm";
import { contenidos, medios, type Contenido } from "@/db/esquema";
import { TIPOS, type TipoContenido } from "@/lib/admin/tipos";

// Este archivo NO importa `@/db` a propósito: todas sus funciones reciben la
// conexión. Así las pruebas lo ejercitan contra PGlite sin arrastrar el
// cliente de Neon, que lanza al cargarse si falta DATABASE_URL. Las versiones
// cacheadas que consume el sitio público viven en `./cacheadas`.

export type ContenidoConImagen = Contenido & {
  imagenUrl: string | null;
  imagenAlt: string | null;
};

export function etiquetaDe(tipo: TipoContenido): string {
  return `contenido:${tipo}`;
}

export const SELECCION = {
  id: contenidos.id,
  tipo: contenidos.tipo,
  slug: contenidos.slug,
  titulo: contenidos.titulo,
  resumen: contenidos.resumen,
  cuerpoHtml: contenidos.cuerpoHtml,
  imagenId: contenidos.imagenId,
  fecha: contenidos.fecha,
  categoria: contenidos.categoria,
  estado: contenidos.estado,
  destacado: contenidos.destacado,
  orden: contenidos.orden,
  extra: contenidos.extra,
  autorId: contenidos.autorId,
  creadoEn: contenidos.creadoEn,
  actualizadoEn: contenidos.actualizadoEn,
  eliminadoEn: contenidos.eliminadoEn,
  imagenUrl: medios.url,
  imagenAlt: medios.alt,
};

/** Cada tipo se ordena por lo suyo: las ideas y los episodios van numerados. */
function ordenDe(tipo: TipoContenido) {
  const config = TIPOS[tipo];
  if (config.ordenPor === "orden") return asc(contenidos.orden);
  return config.fechaAscendente ? asc(contenidos.fecha) : desc(contenidos.fecha);
}

export async function consultarPublicados(
  conexion: any,
  tipo: TipoContenido
): Promise<ContenidoConImagen[]> {
  return conexion
    .select(SELECCION)
    .from(contenidos)
    .leftJoin(medios, eq(contenidos.imagenId, medios.id))
    .where(
      and(
        eq(contenidos.tipo, tipo),
        eq(contenidos.estado, "publicado"),
        isNull(contenidos.eliminadoEn)
      )
    )
    .orderBy(ordenDe(tipo));
}

export async function consultarPublicado(
  conexion: any,
  tipo: TipoContenido,
  slug: string
): Promise<ContenidoConImagen | null> {
  const [fila] = await conexion
    .select(SELECCION)
    .from(contenidos)
    .leftJoin(medios, eq(contenidos.imagenId, medios.id))
    .where(
      and(
        eq(contenidos.tipo, tipo),
        eq(contenidos.slug, slug),
        eq(contenidos.estado, "publicado"),
        isNull(contenidos.eliminadoEn)
      )
    );

  return fila ?? null;
}

/** Lo que está en la papelera, de lo borrado más recientemente a lo más viejo. */
export async function consultarBorrados(conexion: any): Promise<ContenidoConImagen[]> {
  return conexion
    .select(SELECCION)
    .from(contenidos)
    .leftJoin(medios, eq(contenidos.imagenId, medios.id))
    .where(isNotNull(contenidos.eliminadoEn))
    .orderBy(desc(contenidos.eliminadoEn));
}

/** Lectura del panel: incluye borradores, excluye lo que está en la papelera. */
export async function consultarParaPanel(
  conexion: any,
  tipo: TipoContenido,
  filtros: { estado?: "borrador" | "publicado"; busqueda?: string } = {}
): Promise<ContenidoConImagen[]> {
  const condiciones = [eq(contenidos.tipo, tipo), isNull(contenidos.eliminadoEn)];
  if (filtros.estado) condiciones.push(eq(contenidos.estado, filtros.estado));

  const filas: ContenidoConImagen[] = await conexion
    .select(SELECCION)
    .from(contenidos)
    .leftJoin(medios, eq(contenidos.imagenId, medios.id))
    .where(and(...condiciones))
    .orderBy(ordenDe(tipo));

  if (!filtros.busqueda) return filas;

  const aguja = filtros.busqueda.toLowerCase();
  return filas.filter((f) => f.titulo.toLowerCase().includes(aguja));
}
