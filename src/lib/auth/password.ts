import bcrypt from "bcryptjs";

const COSTE = 12;

export async function hashearPassword(plano: string): Promise<string> {
  return bcrypt.hash(plano, COSTE);
}

export async function verificarPassword(plano: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plano, hash);
}

/**
 * Hash de descarte, para gastar el mismo tiempo cuando el correo no existe.
 * Debe ser un hash bcrypt bien formado y del mismo coste que `COSTE`: bcrypt
 * rechaza al instante cualquier cadena que no lo sea, y esa respuesta
 * inmediata delataría que la cuenta no existe. Ninguna contraseña coincide
 * con él, así que la comparación siempre falla tras hacer el trabajo completo.
 */
export const HASH_SENUELO = "$2a$12$Ck1kX3wJz3Yy2rFqPZ9nEe4hV0gT8sJ8kLm3nOpQrStUvWxYz0aBc";
