import { eq } from "drizzle-orm";
import { usuarios, type Usuario } from "@/db/esquema";
import { hashearPassword, verificarPassword, HASH_SENUELO } from "./password";

export const MAX_INTENTOS = 5;
export const MINUTOS_BLOQUEO = 15;
export const LARGO_MINIMO_PASSWORD = 10;

export type ResultadoAuth =
  | { ok: true; usuario: Usuario }
  | { ok: false; motivo: "credenciales" | "bloqueado" | "inactivo" };

export async function crearUsuario(
  db: any,
  datos: { email: string; nombre: string; password: string; rol?: "admin" | "editor" }
): Promise<Usuario> {
  if (datos.password.length < LARGO_MINIMO_PASSWORD) {
    throw new Error(`La contraseña debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres`);
  }

  const [fila] = await db
    .insert(usuarios)
    .values({
      email: datos.email.trim().toLowerCase(),
      nombre: datos.nombre.trim(),
      passwordHash: await hashearPassword(datos.password),
      rol: datos.rol ?? "editor",
    })
    .returning();

  return fila;
}

export async function autenticar(
  db: any,
  email: string,
  password: string
): Promise<ResultadoAuth> {
  const normalizado = email.trim().toLowerCase();
  const [usuario] = await db.select().from(usuarios).where(eq(usuarios.email, normalizado));

  // Se compara igual contra un hash señuelo para que el tiempo de respuesta
  // no delate si el correo existe.
  if (!usuario) {
    await verificarPassword(password, HASH_SENUELO);
    return { ok: false, motivo: "credenciales" };
  }

  if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
    return { ok: false, motivo: "bloqueado" };
  }

  if (!usuario.activo) {
    return { ok: false, motivo: "inactivo" };
  }

  const correcta = await verificarPassword(password, usuario.passwordHash);

  if (!correcta) {
    const intentos = usuario.intentosFallidos + 1;
    await db
      .update(usuarios)
      .set({
        intentosFallidos: intentos,
        bloqueadoHasta:
          intentos >= MAX_INTENTOS ? new Date(Date.now() + MINUTOS_BLOQUEO * 60_000) : null,
      })
      .where(eq(usuarios.id, usuario.id));
    return { ok: false, motivo: "credenciales" };
  }

  await db
    .update(usuarios)
    .set({ intentosFallidos: 0, bloqueadoHasta: null, ultimoAcceso: new Date() })
    .where(eq(usuarios.id, usuario.id));

  return { ok: true, usuario: { ...usuario, intentosFallidos: 0 } };
}
