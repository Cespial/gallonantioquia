import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth/config";
import BarraLateral from "@/components/admin/BarraLateral";

export const metadata = { robots: { index: false, follow: false } };

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const sesion = await auth();
  if (!sesion?.user) redirect("/admin/login");

  const usuario = sesion.user as unknown as { nombre: string; rol: "admin" | "editor" };

  return (
    <div className="min-h-screen flex bg-white">
      <BarraLateral rol={usuario.rol} />
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
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
