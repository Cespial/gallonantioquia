import { requerirSesion } from "@/lib/auth/sesion";
import { db } from "@/db";
import { usuarios } from "@/db/esquema";
import { eq } from "drizzle-orm";
import FormularioPassword from "@/components/admin/FormularioPassword";

export const metadata = { title: "Mi cuenta" };

export default async function PaginaCuenta() {
  const actor = await requerirSesion();
  // El dato se lee de la base, no del token: la sesión es un JWT de ocho horas
  // y seguiría diciendo «debe cambiarla» un buen rato después de cambiarla.
  const [fila] = await db
    .select({ debe: usuarios.debeCambiarPassword })
    .from(usuarios)
    .where(eq(usuarios.id, actor.id));
  const obligatorio = fila?.debe ?? false;

  return (
    <>
      <h1 className="font-display text-2xl mb-1">Mi cuenta</h1>
      <p className="mb-6 text-sm text-texto-secundario">
        {actor.nombre} · {actor.email} ·{" "}
        {actor.rol === "admin" ? "Administrador" : "Editor"}
      </p>

      {obligatorio && (
        <p className="mb-6 max-w-xl rounded-card border border-dorado-tierra bg-dorado-claro/40 p-4 text-sm">
          <strong className="font-medium">Cambia la contraseña para continuar.</strong> La que
          estás usando te la puso quien creó la cuenta, así que él también la conoce. Hasta
          que la cambies, el resto del panel queda bloqueado.
        </p>
      )}

      <FormularioPassword obligatorio={obligatorio} />
    </>
  );
}
