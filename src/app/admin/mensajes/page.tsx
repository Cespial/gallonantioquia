import { desc } from "drizzle-orm";
import { db } from "@/db";
import { mensajes } from "@/db/esquema";
import TablaMensajes from "@/components/admin/TablaMensajes";

export default async function PaginaMensajes() {
  const filas = await db.select().from(mensajes).orderBy(desc(mensajes.creadoEn)).limit(200);
  const sinLeer = filas.filter((f) => !f.leido).length;

  return (
    <>
      <h1 className="font-display text-2xl mb-1">Propuestas de la gente</h1>
      <p className="text-sm text-texto-secundario mb-6">
        Lo que llega por el formulario «Te escuchamos».{" "}
        {sinLeer > 0 ? `Hay ${sinLeer} sin leer.` : "Están todas leídas."} Son datos personales:
        no los compartas fuera del equipo.
      </p>
      <TablaMensajes filas={filas} />
    </>
  );
}
