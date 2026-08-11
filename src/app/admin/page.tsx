import Link from "next/link";
import { count, isNull } from "drizzle-orm";
import { db } from "@/db";
import { contenidos } from "@/db/esquema";
import { LISTA_TIPOS } from "@/lib/admin/tipos";

/**
 * Concuerda en género y número con el tipo: «4 publicadas» para la columna,
 * «4 publicados» para el episodio. El artículo lo declara cada ConfigTipo.
 */
function participio(articulo: "la" | "el", cantidad: number): string {
  const raiz = articulo === "el" ? "publicado" : "publicada";
  return cantidad === 1 ? raiz : `${raiz}s`;
}

export default async function PaginaResumen() {
  // Un solo recorrido de la tabla: se agrupa por tipo y estado y luego se
  // reparte en memoria, en vez de doce consultas de conteo.
  const filas = await db
    .select({ tipo: contenidos.tipo, estado: contenidos.estado, n: count() })
    .from(contenidos)
    .where(isNull(contenidos.eliminadoEn))
    .groupBy(contenidos.tipo, contenidos.estado);

  const conteo = new Map<string, { publicado: number; borrador: number }>();
  for (const fila of filas) {
    const actual = conteo.get(fila.tipo) ?? { publicado: 0, borrador: 0 };
    actual[fila.estado] = Number(fila.n);
    conteo.set(fila.tipo, actual);
  }

  return (
    <>
      <h1 className="font-display text-2xl mb-1">Resumen</h1>
      <p className="text-sm text-texto-secundario mb-6">
        Lo que hay hoy en el sitio. Entra a una sección para publicar o editar.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LISTA_TIPOS.map((tipo) => {
          const n = conteo.get(tipo.tipo) ?? { publicado: 0, borrador: 0 };
          return (
            <li key={tipo.tipo}>
              <Link
                href={`/admin/${tipo.rutaAdmin}`}
                className="block rounded-card border border-borde p-4 hover:border-verde-antioquia"
              >
                <p className="font-medium text-texto-principal">{tipo.etiqueta}</p>
                <p className="mt-2 text-sm text-texto-secundario">
                  {n.publicado} {participio(tipo.articulo, n.publicado)} · {n.borrador} en
                  borrador
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
