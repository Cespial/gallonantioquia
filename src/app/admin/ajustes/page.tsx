import { redirect } from "next/navigation";
import { db } from "@/db";
import { auth } from "@/lib/auth/config";
import { consultarAjustes, contarHistorial } from "@/lib/ajustes";
import { consultarMedios } from "@/lib/medios/reglas";
import PestanasAjustes from "@/components/admin/ajustes/PestanasAjustes";

export default async function PaginaAjustes() {
  const sesion = await auth();
  const actor = sesion?.user as unknown as { rol: "admin" | "editor" } | undefined;
  if (!actor) redirect("/admin/login");
  const esAdmin = actor.rol === "admin";

  // `historial` dice qué claves tienen algo que deshacer: sin él, el botón
  // «Deshacer» de cada franja no sabría si está habilitado hasta pulsarlo.
  const [ajustes, medios, historial] = await Promise.all([
    consultarAjustes(db),
    consultarMedios(db),
    contarHistorial(db),
  ]);

  return (
    <>
      <h1 className="font-display text-2xl mb-1">Ajustes</h1>
      <p className="text-sm text-texto-secundario mb-6">
        Lo que se configura aquí sale al sitio en segundos, sin volver a desplegar.
        {!esAdmin && " Las pestañas que no ves las maneja un administrador."}
      </p>
      <PestanasAjustes
        esAdmin={esAdmin}
        ajustes={ajustes}
        medios={medios}
        historial={historial}
      />
    </>
  );
}
