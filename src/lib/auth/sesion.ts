import { auth } from "./config";
import { tieneClavePendiente } from "./clave-pendiente";

export interface SesionUsuario {
  id: string;
  email: string;
  nombre: string;
  rol: "admin" | "editor";
}

/**
 * Primera línea de toda Server Action del panel. Ocultar un botón en la
 * interfaz no es control de acceso; esto sí.
 *
 * También es donde se aplica el cambio de contraseña obligatorio, y se aplica
 * aquí a propósito: bloquearlo solo en la pantalla dejaría todas las acciones
 * abiertas para quien mande el POST a mano, que es justo el escenario que el
 * bloqueo intenta cerrar. Poniéndolo en la puerta común, cualquier acción que
 * se escriba mañana queda cubierta sin que nadie tenga que acordarse.
 */
export async function requerirSesion(opciones?: {
  /** Solo el propio cambio de contraseña, que si no se muerde la cola. */
  permitirClavePendiente?: boolean;
}): Promise<SesionUsuario> {
  const sesion = await auth();
  if (!sesion?.user) throw new Error("NO_AUTENTICADO");
  const usuario = sesion.user as unknown as SesionUsuario;

  if (!opciones?.permitirClavePendiente && (await tieneClavePendiente(usuario.id))) {
    throw new Error("CLAVE_PENDIENTE");
  }

  return usuario;
}

export async function requerirAdmin(): Promise<SesionUsuario> {
  const usuario = await requerirSesion();
  if (usuario.rol !== "admin") throw new Error("SIN_PERMISO");
  return usuario;
}
