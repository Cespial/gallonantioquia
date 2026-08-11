"use server";

import { revalidatePath } from "next/cache";
import { and, eq, count } from "drizzle-orm";
import { db } from "@/db";
import { usuarios } from "@/db/esquema";
import { requerirAdmin } from "./sesion";
import { crearUsuario } from "./usuarios";
import { puedeDesactivar, type Resultado } from "./reglas";

// Este archivo solo exporta funciones async: es la regla de un módulo
// `"use server"`. La regla pura `puedeDesactivar` y el tipo `Resultado` viven
// en `./reglas` y desde aquí solo se consumen, nunca se reexportan.

async function contarAdminsActivos(): Promise<number> {
  const [fila] = await db
    .select({ n: count() })
    .from(usuarios)
    .where(and(eq(usuarios.rol, "admin"), eq(usuarios.activo, true)));
  return Number(fila.n);
}

export async function invitarUsuario(datos: FormData): Promise<Resultado> {
  await requerirAdmin();

  const email = String(datos.get("email") ?? "").trim().toLowerCase();
  const nombre = String(datos.get("nombre") ?? "").trim();
  const rol = String(datos.get("rol") ?? "editor") as "admin" | "editor";
  const password = String(datos.get("password") ?? "");

  if (!email || !nombre) return { ok: false, error: "El nombre y el correo son obligatorios." };

  try {
    await crearUsuario(db, { email, nombre, password, rol });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "No se pudo crear el usuario.";
    return {
      ok: false,
      error: mensaje.includes("unique") ? "Ese correo ya tiene cuenta." : mensaje,
    };
  }

  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function cambiarRol(id: string, rol: "admin" | "editor"): Promise<Resultado> {
  const actor = await requerirAdmin();

  if (id === actor.id && rol !== "admin") {
    return { ok: false, error: "No puedes quitarte a ti mismo el rol de administrador." };
  }
  if (rol === "editor" && (await contarAdminsActivos()) <= 1) {
    return { ok: false, error: "No puedes dejar el sitio sin administradores." };
  }

  await db.update(usuarios).set({ rol }).where(eq(usuarios.id, id));
  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function cambiarEstado(id: string, activo: boolean): Promise<Resultado> {
  const actor = await requerirAdmin();

  if (!activo) {
    const [objetivo] = await db.select().from(usuarios).where(eq(usuarios.id, id));
    if (!objetivo) return { ok: false, error: "Ese usuario no existe." };

    const permiso = puedeDesactivar(objetivo, actor.id, await contarAdminsActivos());
    if (!permiso.ok) return { ok: false, error: permiso.error! };
  }

  await db
    .update(usuarios)
    .set({ activo, intentosFallidos: 0, bloqueadoHasta: null })
    .where(eq(usuarios.id, id));

  revalidatePath("/admin/usuarios");
  return { ok: true };
}
