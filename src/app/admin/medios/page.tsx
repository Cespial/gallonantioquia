import { auth } from "@/lib/auth/config";
import { db } from "@/db";
import { consultarMedios } from "@/lib/medios/reglas";
import BibliotecaMedios from "@/components/admin/BibliotecaMedios";

export default async function PaginaMedios() {
  const sesion = await auth();
  const usuario = sesion?.user as unknown as { rol: "admin" | "editor" } | undefined;

  const filas = await consultarMedios(db);

  return (
    <>
      <h1 className="font-display text-2xl mb-1">Fotos</h1>
      <p className="text-sm text-texto-secundario mb-6">
        Todo lo que subas aquí queda disponible como portada de cualquier contenido. Escribe
        siempre la descripción: es lo que leen quienes navegan con lector de pantalla.
      </p>
      <BibliotecaMedios filas={filas} esAdmin={usuario?.rol === "admin"} />
    </>
  );
}
