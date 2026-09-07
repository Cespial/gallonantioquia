import { eq } from "drizzle-orm";
import { usuarios, type Usuario } from "@/db/esquema";
import { hashearPassword, verificarPassword, HASH_SENUELO } from "./password";
import { LARGO_MINIMO_PASSWORD } from "./reglas";

export const MAX_INTENTOS = 5;
export const MINUTOS_BLOQUEO = 15;
export { LARGO_MINIMO_PASSWORD };

export type ResultadoAuth =
  | { ok: true; usuario: Usuario }
  | { ok: false; motivo: "credenciales" | "bloqueado" | "inactivo" };

export async function crearUsuario(
  db: any,
  datos: {
    email: string;
    nombre: string;
    password: string;
    rol?: "admin" | "editor";
    /** Solo el sembrado del primer administrador lo pone en `false`. */
    debeCambiarPassword?: boolean;
  }
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
      // Quien crea la cuenta escoge la primera clave, así que la conoce. El
      // panel obliga a cambiarla antes de dejar hacer nada más.
      debeCambiarPassword: datos.debeCambiarPassword ?? true,
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

/**
 * Cambia la contraseña de una cuenta comprobando primero la actual.
 *
 * Pide la actual aunque haya sesión abierta: sin eso, un computador dejado
 * abierto en la sede de campaña basta para que alguien se quede con la cuenta.
 * De paso limpia el bloqueo por intentos fallidos, porque quien acaba de
 * demostrar que sabe la clave no tiene por qué seguir castigado.
 */
export async function cambiarPasswordPropia(
  db: any,
  id: string,
  actual: string,
  nueva: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, id));
  if (!usuario) return { ok: false, error: "La cuenta ya no existe." };

  if (!(await verificarPassword(actual, usuario.passwordHash))) {
    return { ok: false, error: "La contraseña actual no es correcta." };
  }

  await db
    .update(usuarios)
    .set({
      passwordHash: await hashearPassword(nueva),
      debeCambiarPassword: false,
      intentosFallidos: 0,
      bloqueadoHasta: null,
    })
    .where(eq(usuarios.id, id));

  return { ok: true };
}

/**
 * Un administrador le pone una clave temporal a otra cuenta.
 *
 * Es la salida para quien olvidó la suya: hasta ahora la única forma era
 * entrar a la base a mano. Deja la cuenta obligada a cambiarla, así que la
 * clave que el administrador escribe muere en el primer ingreso.
 */
export async function restablecerPassword(
  db: any,
  id: string,
  temporal: string
): Promise<void> {
  await db
    .update(usuarios)
    .set({
      passwordHash: await hashearPassword(temporal),
      debeCambiarPassword: true,
      intentosFallidos: 0,
      bloqueadoHasta: null,
    })
    .where(eq(usuarios.id, id));
}
