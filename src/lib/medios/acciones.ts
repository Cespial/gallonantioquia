"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { medios } from "@/db/esquema";
import { requerirSesion, requerirAdmin } from "@/lib/auth/sesion";
import { contarUsos, registrarMedio } from "./reglas";

export type Resultado = { ok: true } | { ok: false; error: string };

/**
 * Anota una subida en cuanto el navegador la termina.
 *
 * El webhook `onUploadCompleted` de /api/medios/subir también la anota, pero
 * llega después del `router.refresh()` del navegador, así que la foto recién
 * subida no salía en la lista hasta recargar a mano. Con esta acción la fila
 * existe antes del refresco; el webhook la encuentra y no duplica.
 */
export async function anotarSubida(url: string, nombre: string): Promise<Resultado> {
  const usuario = await requerirSesion();
  if (!url.startsWith("https://")) return { ok: false, error: "Dirección de archivo no válida." };
  await registrarMedio(db, { url, nombre, subidoPor: usuario.id });
  revalidatePath("/admin/medios");
  return { ok: true };
}

export async function actualizarAlt(id: string, alt: string): Promise<Resultado> {
  await requerirSesion();

  const [fila] = await db
    .update(medios)
    .set({ alt: alt.trim() || null })
    .where(eq(medios.id, id))
    .returning({ id: medios.id });

  if (!fila) return { ok: false, error: "Esa foto ya no existe." };

  revalidatePath("/admin/medios");
  return { ok: true };
}

export async function borrarMedio(id: string): Promise<Resultado> {
  await requerirAdmin();

  const [fila] = await db.select().from(medios).where(eq(medios.id, id));
  if (!fila) return { ok: false, error: "Esa foto ya no existe." };

  const usos = await contarUsos(db, id);
  if (usos > 0) {
    return {
      ok: false,
      error: `Esa foto está en uso en ${usos} ${usos === 1 ? "contenido" : "contenidos"}. Cámbialas antes de borrarla.`,
    };
  }

  // Solo se borra el objeto remoto. Las rutas heredadas `/images/…` viven en
  // el repositorio: borrar esa fila desvincula, pero el archivo se queda.
  if (fila.url.startsWith("https://")) {
    try {
      await del(fila.url);
    } catch {
      return { ok: false, error: "No se pudo borrar el archivo. Intenta de nuevo." };
    }
  }

  await db.delete(medios).where(eq(medios.id, id));

  revalidatePath("/admin/medios");
  return { ok: true };
}
