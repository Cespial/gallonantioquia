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
