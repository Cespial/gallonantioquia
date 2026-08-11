import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contenidos } from "@/db/esquema";
import { configPorRutaAdmin } from "@/lib/admin/tipos";
import FormularioContenido from "@/components/admin/FormularioContenido";

type Props = { params: { seccion: string; id: string } };

export default async function PaginaEditor({ params }: Props) {
  const { seccion, id } = params;

  const config = configPorRutaAdmin(seccion);
  if (!config) notFound();

  const esNuevo = id === "nuevo";
  let contenido = null;

  if (!esNuevo) {
    const [fila] = await db.select().from(contenidos).where(eq(contenidos.id, id));
    if (!fila || fila.tipo !== config.tipo) notFound();
    contenido = fila;
  }

  return (
    <>
      <h1 className="font-display text-2xl mb-6">
        {esNuevo
          ? `${config.articulo === "la" ? "Nueva" : "Nuevo"} ${config.singular}`
          : `Editar ${config.singular}`}
      </h1>
      <FormularioContenido config={config} contenido={contenido} />
    </>
  );
}
