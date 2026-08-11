import { notFound } from "next/navigation";
import Link from "next/link";
import { configPorRutaAdmin } from "@/lib/admin/tipos";
import { listarParaPanel } from "@/lib/contenidos/cacheadas";
import ListadoContenidos from "@/components/admin/ListadoContenidos";

// `params` y `searchParams` son objetos, no promesas: esto es Next 14.2. La
// firma con `Promise<…>` es de Next 15 y aquí solo funcionaría de casualidad,
// porque `await` sobre un valor plano lo devuelve tal cual.
type Props = {
  params: { seccion: string };
  searchParams: { estado?: string; q?: string };
};

export default async function PaginaSeccion({ params, searchParams }: Props) {
  const config = configPorRutaAdmin(params.seccion);
  if (!config) notFound();

  const { estado, q } = searchParams;

  const filas = await listarParaPanel(config.tipo, {
    estado: estado === "borrador" || estado === "publicado" ? estado : undefined,
    busqueda: q,
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl">{config.etiqueta}</h1>
          <p className="text-sm text-texto-secundario mt-1">
            {filas.length} {filas.length === 1 ? config.singular : config.plural}
          </p>
        </div>
        <Link
          href={`/admin/${config.rutaAdmin}/nuevo`}
          className="rounded-lg bg-verde-antioquia px-4 py-2 text-sm font-medium text-white"
        >
          {config.articulo === "la" ? "Nueva" : "Nuevo"} {config.singular}
        </Link>
      </div>

      <ListadoContenidos
        config={config}
        filas={filas}
        filtroEstado={estado ?? ""}
        busqueda={q ?? ""}
      />
    </>
  );
}
