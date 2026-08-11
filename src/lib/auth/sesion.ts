import { auth } from "./config";

export interface SesionUsuario {
  id: string;
  email: string;
  nombre: string;
  rol: "admin" | "editor";
}

/**
 * Primera línea de toda Server Action del panel. Ocultar un botón en la
 * interfaz no es control de acceso; esto sí.
 */
export async function requerirSesion(): Promise<SesionUsuario> {
  const sesion = await auth();
  if (!sesion?.user) throw new Error("NO_AUTENTICADO");
  return sesion.user as unknown as SesionUsuario;
}

export async function requerirAdmin(): Promise<SesionUsuario> {
  const usuario = await requerirSesion();
  if (usuario.rol !== "admin") throw new Error("SIN_PERMISO");
  return usuario;
}
