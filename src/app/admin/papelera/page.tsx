import { listarBorrados } from "@/lib/contenidos/cacheadas";
import TablaPapelera from "@/components/admin/TablaPapelera";

export default async function PaginaPapelera() {
  const filas = await listarBorrados();

  return (
    <>
      <h1 className="font-display text-2xl mb-1">Papelera</h1>
      <p className="text-sm text-texto-secundario mb-6">
        Al restaurar, el contenido vuelve como borrador. Publícalo de nuevo si quieres que
        aparezca en el sitio.
      </p>
      <TablaPapelera filas={filas} />
    </>
  );
}
