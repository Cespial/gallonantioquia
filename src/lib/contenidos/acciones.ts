"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contenidos } from "@/db/esquema";
import { TIPOS, type TipoContenido } from "@/lib/admin/tipos";
import { requerirSesion } from "@/lib/auth/sesion";
import { etiquetaDe } from "./consultas";
import {
  prepararFila,
  intercambiarOrden,
  type Resultado,
  type ResultadoGuardar,
} from "./operaciones";

// Todo lo que este archivo exporta es un endpoint alcanzable desde el
// navegador, así que aquí solo hay funciones async que empiezan verificando
// la sesión. La lógica pura y la que recibe conexión viven en `./operaciones`.

function crudoDesdeFormData(datos: FormData): Record<string, string> {
  const crudo: Record<string, string> = {};
  datos.forEach((valor, clave) => {
    crudo[clave] = String(valor);
  });
  return crudo;
}

export async function guardarContenido(
  tipo: TipoContenido,
  id: string | null,
  datos: FormData
): Promise<ResultadoGuardar> {
  const usuario = await requerirSesion();

  const preparado = prepararFila(tipo, crudoDesdeFormData(datos));
  if (!preparado.ok) return preparado;

  let idFinal = id;

  try {
    if (id) {
      await db
        .update(contenidos)
        .set({ ...preparado.fila, actualizadoEn: new Date() })
        .where(eq(contenidos.id, id));
    } else {
      const [fila] = await db
        .insert(contenidos)
        .values({ ...preparado.fila, tipo, autorId: usuario.id })
        .returning({ id: contenidos.id });
      idFinal = fila.id;
    }
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "";
    if (mensaje.includes("contenidos_tipo_slug_vivo")) {
      return { ok: false, errores: { slug: "Ya existe otro contenido con esa dirección." } };
    }
    return { ok: false, errores: { general: "No se pudo guardar. Intenta de nuevo." } };
  }

  revalidateTag(etiquetaDe(tipo));
  revalidatePath(`/admin/${TIPOS[tipo].rutaAdmin}`);
  return { ok: true, id: idFinal! };
}

export async function cambiarEstadoContenido(
  id: string,
  estado: "borrador" | "publicado"
): Promise<Resultado> {
  await requerirSesion();

  const [fila] = await db
    .update(contenidos)
    .set({ estado, actualizadoEn: new Date() })
    .where(eq(contenidos.id, id))
    .returning({ tipo: contenidos.tipo });

  if (!fila) return { ok: false, error: "Ese contenido no existe." };

  revalidateTag(etiquetaDe(fila.tipo));
  revalidatePath(`/admin/${TIPOS[fila.tipo].rutaAdmin}`);
  return { ok: true };
}

export async function borrarContenido(id: string): Promise<Resultado> {
  await requerirSesion();

  const [fila] = await db
    .update(contenidos)
    .set({ eliminadoEn: new Date() })
    .where(eq(contenidos.id, id))
    .returning({ tipo: contenidos.tipo });

  if (!fila) return { ok: false, error: "Ese contenido no existe." };

  revalidateTag(etiquetaDe(fila.tipo));
  revalidatePath(`/admin/${TIPOS[fila.tipo].rutaAdmin}`);
  revalidatePath("/admin/papelera");
  return { ok: true };
}

/**
 * Restaurar devuelve el contenido a borrador aunque estuviera publicado al
 * borrarse: sacar algo de la papelera no debe republicarlo en el sitio sin
 * que alguien lo decida.
 */
export async function restaurarContenido(id: string): Promise<Resultado> {
  await requerirSesion();

  const [fila] = await db
    .update(contenidos)
    .set({ eliminadoEn: null, estado: "borrador" })
    .where(eq(contenidos.id, id))
    .returning({ tipo: contenidos.tipo });

  if (!fila) return { ok: false, error: "Ese contenido no existe." };

  revalidateTag(etiquetaDe(fila.tipo));
  revalidatePath("/admin/papelera");
  return { ok: true };
}

export async function reordenarContenido(
  id: string,
  direccion: "arriba" | "abajo"
): Promise<Resultado> {
  await requerirSesion();

  const resultado = await intercambiarOrden(db, id, direccion);
  if (!resultado.ok) return resultado;

  const [fila] = await db
    .select({ tipo: contenidos.tipo })
    .from(contenidos)
    .where(eq(contenidos.id, id));

  if (fila) {
    revalidateTag(etiquetaDe(fila.tipo));
    revalidatePath(`/admin/${TIPOS[fila.tipo].rutaAdmin}`);
  }

  return { ok: true };
}
