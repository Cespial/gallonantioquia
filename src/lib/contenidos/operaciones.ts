import { and, asc, desc, eq, gt, isNull, lt } from "drizzle-orm";
import { contenidos, type NuevoContenido } from "@/db/esquema";
import { TIPOS, type TipoContenido } from "@/lib/admin/tipos";
import { esquemaContenido } from "@/lib/admin/esquemas";
import { sanitizarHtml } from "@/lib/admin/sanitizar";
import { generarSlug } from "@/lib/admin/slug";

// Lógica de contenido que no es Server Action: o es pura, o recibe la
// conexión. Nada de esto puede vivir en `./acciones`, que lleva `"use server"`
// y por tanto solo admite exportar funciones async — y convierte en endpoint
// público todo lo que exporta.

export type Resultado = { ok: true } | { ok: false; error: string };
export type ResultadoGuardar =
  | { ok: true; id: string }
  | { ok: false; errores: Record<string, string> };

export type Crudo = Record<string, string>;

/** Valida el formulario y arma la fila lista para escribir. */
export function prepararFila(
  tipo: TipoContenido,
  crudo: Crudo
):
  | { ok: true; fila: Omit<NuevoContenido, "tipo"> }
  | { ok: false; errores: Record<string, string> } {
  const slug = crudo.slug?.trim() || generarSlug(crudo.titulo ?? "");

  const candidato = {
    slug,
    titulo: crudo.titulo ?? "",
    resumen: crudo.resumen || null,
    cuerpoHtml: TIPOS[tipo].usaCuerpo ? sanitizarHtml(crudo.cuerpoHtml ?? "") : null,
    fecha: crudo.fecha ?? "",
    categoria: TIPOS[tipo].taxonomia ? crudo.categoria || null : null,
    estado: (crudo.estado ?? "borrador") as "borrador" | "publicado",
    destacado: crudo.destacado === "true",
    orden: Number(crudo.orden ?? 0),
    imagenId: crudo.imagenId?.trim() ? crudo.imagenId : null,
    extra: JSON.parse(crudo.extra || "{}"),
  };

  const resultado = esquemaContenido(tipo).safeParse(candidato);

  if (!resultado.success) {
    const errores: Record<string, string> = {};
    for (const problema of resultado.error.issues) {
      errores[problema.path.join(".")] = problema.message;
    }
    return { ok: false, errores };
  }

  return {
    ok: true,
    fila: { ...resultado.data, imagenId: candidato.imagenId } as Omit<NuevoContenido, "tipo">,
  };
}

/**
 * Intercambia la posición de un contenido con la de su vecino vivo. Se mueve
 * por intercambio y no por renumeración para no dejar huecos ni empates.
 */
export async function intercambiarOrden(
  conexion: any,
  id: string,
  direccion: "arriba" | "abajo"
): Promise<Resultado> {
  const [actual] = await conexion.select().from(contenidos).where(eq(contenidos.id, id));
  if (!actual) return { ok: false, error: "Ese contenido no existe." };

  const [vecino] = await conexion
    .select()
    .from(contenidos)
    .where(
      and(
        eq(contenidos.tipo, actual.tipo),
        isNull(contenidos.eliminadoEn),
        direccion === "arriba"
          ? lt(contenidos.orden, actual.orden)
          : gt(contenidos.orden, actual.orden)
      )
    )
    .orderBy(direccion === "arriba" ? desc(contenidos.orden) : asc(contenidos.orden))
    .limit(1);

  // Ya está en el extremo: no es un error, simplemente no hay nada que hacer.
  if (!vecino) return { ok: true };

  await conexion
    .update(contenidos)
    .set({ orden: vecino.orden })
    .where(eq(contenidos.id, actual.id));
  await conexion
    .update(contenidos)
    .set({ orden: actual.orden })
    .where(eq(contenidos.id, vecino.id));

  return { ok: true };
}
