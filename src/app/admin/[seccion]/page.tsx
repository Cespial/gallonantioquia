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

      {/* La ruta sigue viva aunque el tipo esté dormido: los datos no se
          pierden y el día que la página lo reciba basta cambiar `enElSitio`.
          Pero quien llegue aquí escribiendo la URL merece saber que lo que
          publique no lo va a ver nadie. */}
      {!config.enElSitio && (
        <p className="mb-6 rounded-card border border-dorado-tierra bg-dorado-claro/40 p-4 text-sm">
          <strong className="font-medium">Esto no sale en el sitio.</strong> Ninguna página
          enlaza «{config.etiqueta}» hoy, así que lo que publiques aquí no lo verá ningún
          visitante. Lo guardado sigue intacto por si la sección vuelve.
        </p>
      )}

      <ListadoContenidos
        config={config}
        filas={filas}
        filtroEstado={estado ?? ""}
        busqueda={q ?? ""}
      />
    </>
  );
}
