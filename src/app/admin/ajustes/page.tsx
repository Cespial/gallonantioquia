import { redirect } from "next/navigation";
import { db } from "@/db";
import { auth } from "@/lib/auth/config";
import { consultarAjustes } from "@/lib/ajustes";
import { consultarMedios } from "@/lib/medios/reglas";
import { listarParaPanel } from "@/lib/contenidos/cacheadas";
import PestanasAjustes from "@/components/admin/PestanasAjustes";

export default async function PaginaAjustes() {
  const sesion = await auth();
  const actor = sesion?.user as unknown as { rol: string } | undefined;
  if (actor?.rol !== "admin") redirect("/admin");

  const [ajustes, medios, bitacoras] = await Promise.all([
    consultarAjustes(db),
    consultarMedios(db),
    listarParaPanel("bitacora", { estado: "publicado" }),
  ]);

  return (
    <>
      <h1 className="font-display text-2xl mb-1">Ajustes</h1>
      <p className="text-sm text-texto-secundario mb-6">
        Lo que se configura aquí sale al sitio en segundos, sin volver a desplegar.
      </p>
      <PestanasAjustes
        ajustes={ajustes}
        medios={medios}
        bitacoras={bitacoras.map((b) => ({ id: b.id, titulo: b.titulo }))}
      />
    </>
  );
}
