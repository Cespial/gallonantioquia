// Reglas puras y tipos compartidos de la gestión de usuarios.
//
// Viven fuera de `acciones.ts` por dos razones que se descubrieron al
// implementarlas ahí: un archivo `"use server"` solo admite exportar funciones
// async — el build responde «Server actions must be async functions» —, y
// `acciones.ts` abre la conexión a Postgres al cargarse, así que una prueba
// que solo quiere ejercitar la regla no podría importarla sin base de datos.

export type Resultado = { ok: true } | { ok: false; error: string };

export function puedeDesactivar(
  objetivo: { id: string; rol: "admin" | "editor" },
  actorId: string,
  adminsActivos: number
): { ok: boolean; error?: string } {
  if (objetivo.id === actorId) {
    return { ok: false, error: "No puedes desactivarte a ti mismo." };
  }
  if (objetivo.rol === "admin" && adminsActivos <= 1) {
    return { ok: false, error: "No puedes desactivar al último administrador activo." };
  }
  return { ok: true };
}

export const LARGO_MINIMO_PASSWORD = 10;

/**
 * Revisa una contraseña nueva antes de tocar la base.
 *
 * Es pura y vive aquí, junto a `puedeDesactivar`, por lo mismo: `acciones.ts`
 * abre la conexión a Postgres al cargarse y una prueba de la regla no debería
 * necesitar base de datos.
 *
 * La repetición se pide en el formulario y se comprueba también en el
 * servidor: quien manda el POST a mano se salta el campo, y una clave con un
 * dedazo que nadie confirmó deja a la persona fuera de su propia cuenta.
 */
export function revisarPasswordNueva(
  nueva: string,
  repetida: string,
  actual: string
): Resultado {
  if (nueva.length < LARGO_MINIMO_PASSWORD) {
    return {
      ok: false,
      error: `La contraseña nueva debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres.`,
    };
  }
  if (nueva !== repetida) {
    return { ok: false, error: "Las dos contraseñas nuevas no coinciden." };
  }
  if (nueva === actual) {
    return { ok: false, error: "La contraseña nueva tiene que ser distinta de la actual." };
  }
  return { ok: true };
}
