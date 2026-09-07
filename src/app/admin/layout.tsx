import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth/config";
import { tieneClavePendiente } from "@/lib/auth/clave-pendiente";
import BarraLateral from "@/components/admin/BarraLateral";
import FormularioPassword from "@/components/admin/FormularioPassword";

export const metadata = { robots: { index: false, follow: false } };

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const sesion = await auth();
  if (!sesion?.user) redirect("/admin/login");

  const usuario = sesion.user as unknown as {
    id: string;
    nombre: string;
    rol: "admin" | "editor";
  };

  // Con la clave sin estrenar no se redirige a otra ruta: el layout envuelve
  // también a esa ruta, así que redirigir desde aquí se muerde la cola. Se
  // cambia lo que se pinta y ya. El bloqueo de verdad no es este —lo hace
  // `requerirSesion` en cada acción—; esto es solo lo que se ve.
  const clavePendiente = await tieneClavePendiente(usuario.id);

  return (
    <div className="min-h-screen flex bg-white">
      {!clavePendiente && <BarraLateral rol={usuario.rol} />}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-borde px-6 py-3">
          <span className="text-sm text-texto-secundario">
            {usuario.nombre} · {usuario.rol === "admin" ? "Administrador" : "Editor"}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-texto-secundario hover:text-verde-antioquia"
            >
              Salir
            </button>
          </form>
        </header>
        <main className="p-6">
          {clavePendiente ? (
            <>
              <h1 className="font-display text-2xl mb-1">Estrena tu contraseña</h1>
              <p className="mb-6 max-w-xl text-sm text-texto-secundario">
                La que estás usando te la puso quien creó la cuenta, así que él también la
                conoce. Cámbiala y el panel se abre.
              </p>
              <FormularioPassword obligatorio />
            </>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
