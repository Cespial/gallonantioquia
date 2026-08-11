import { unstable_cache } from "next/cache";
import { db } from "@/db";
import type { TipoContenido } from "@/lib/admin/tipos";
import {
  consultarPublicados,
  consultarPublicado,
  consultarParaPanel,
  consultarBorrados,
  etiquetaDe,
  type ContenidoConImagen,
} from "./consultas";

/**
 * Lecturas que consume el sitio público, cacheadas por etiqueta. Publicar
 * desde el panel llama a `revalidateTag` con la misma etiqueta, así que el
 * cambio sale al aire en segundos, sin rebuild y sin una consulta por visita.
 */
export function listarPublicados(tipo: TipoContenido): Promise<ContenidoConImagen[]> {
  return unstable_cache(() => consultarPublicados(db, tipo), ["contenidos", tipo], {
    tags: [etiquetaDe(tipo)],
  })();
}

export function obtenerPublicado(
  tipo: TipoContenido,
  slug: string
): Promise<ContenidoConImagen | null> {
  return unstable_cache(() => consultarPublicado(db, tipo, slug), ["contenido", tipo, slug], {
    tags: [etiquetaDe(tipo)],
  })();
}

export function listarBorrados(): Promise<ContenidoConImagen[]> {
  return consultarBorrados(db);
}

/** Lectura del panel: sin caché, porque el editor debe ver su cambio ya. */
export function listarParaPanel(
  tipo: TipoContenido,
  filtros: { estado?: "borrador" | "publicado"; busqueda?: string } = {}
): Promise<ContenidoConImagen[]> {
  return consultarParaPanel(db, tipo, filtros);
}
