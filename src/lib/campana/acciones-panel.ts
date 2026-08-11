"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mensajes } from "@/db/esquema";
import { requerirSesion, requerirAdmin } from "@/lib/auth/sesion";

export type Resultado = { ok: true } | { ok: false; error: string };

export async function marcarLeido(id: string, leido: boolean): Promise<Resultado> {
  await requerirSesion();

  await db.update(mensajes).set({ leido }).where(eq(mensajes.id, id));
  revalidatePath("/admin/mensajes");
  return { ok: true };
}

/** Borrar de verdad: es un dato personal y quien lo pide tiene derecho a ello. */
export async function borrarMensaje(id: string): Promise<Resultado> {
  await requerirAdmin();

  await db.delete(mensajes).where(eq(mensajes.id, id));
  revalidatePath("/admin/mensajes");
  return { ok: true };
}
