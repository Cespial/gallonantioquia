import { and, desc, eq, notInArray, sql } from "drizzle-orm";
import { ajustes, ajustesHistorial } from "@/db/esquema";
import { CLAVES, type ClaveAjuste, type ValorDe } from "./claves";

/** Cuántas versiones anteriores se conservan por clave. */
const TOPE_HISTORIAL = 20;

// Como en contenidos y medios: este archivo no importa `@/db`, para que las
// pruebas lo ejerciten contra PGlite. Las lecturas cacheadas están en
// `./cacheadas` y la Server Action en `./acciones`.
export * from "./claves";

/**
 * Nunca lanza al leer. Si lo guardado no valida contra el esquema actual —una
 * clave escrita por una versión anterior, por ejemplo— devuelve el valor por
 * defecto: un cambio de esquema no puede tumbar el sitio público.
 */
export async function consultarAjuste<K extends ClaveAjuste>(
  conexion: any,
  clave: K
): Promise<ValorDe<K>> {
  const definicion = CLAVES[clave];

  const [fila] = await conexion.select().from(ajustes).where(eq(ajustes.clave, clave));
  if (!fila) return definicion.porDefecto as ValorDe<K>;

  const revision = definicion.esquema.safeParse(fila.valor);
  return revision.success ? (revision.data as ValorDe<K>) : (definicion.porDefecto as ValorDe<K>);
}

export async function escribirAjuste<K extends ClaveAjuste>(
  conexion: any,
  clave: K,
  valor: ValorDe<K>,
  actorId?: string | null
): Promise<void> {
  // Aquí sí lanza: escribir basura es un error de quien llama, no un dato
  // heredado que haya que tolerar.
  const limpio = CLAVES[clave].esquema.parse(valor);

  // Fila cruda, no `consultarAjuste`: necesitamos saber si YA había un valor
  // guardado (para decidir si hay algo que archivar), no el valor por
  // defecto que `consultarAjuste` devuelve cuando no hay fila.
  const [previa] = await conexion.select().from(ajustes).where(eq(ajustes.clave, clave));
  if (previa) {
    await conexion.insert(ajustesHistorial).values({
      clave,
      valor: previa.valor,
      actorId: actorId ?? null,
    });
  }

  await conexion
    .insert(ajustes)
    .values({ clave, valor: limpio })
    .onConflictDoUpdate({
      target: ajustes.clave,
      set: { valor: limpio, actualizadoEn: new Date() },
    });

  if (previa) await podarHistorial(conexion, clave);
}

/** Deja solo las `TOPE_HISTORIAL` filas más recientes de historial de una clave. */
async function podarHistorial(conexion: any, clave: ClaveAjuste): Promise<void> {
  const recientes = await conexion
    .select({ id: ajustesHistorial.id })
    .from(ajustesHistorial)
    .where(eq(ajustesHistorial.clave, clave))
    .orderBy(desc(ajustesHistorial.creadoEn))
    .limit(TOPE_HISTORIAL);

  const idsAConservar = recientes.map((f: { id: string }) => f.id);
  if (idsAConservar.length === 0) return;

  await conexion
    .delete(ajustesHistorial)
    .where(and(eq(ajustesHistorial.clave, clave), notInArray(ajustesHistorial.id, idsAConservar)));
}

/**
 * Deshace el último cambio de una clave: pop de la pila de historial. Escribe
 * el valor archivado como el actual **sin** registrar historial —si eso
 * generara una entrada, deshacer dos veces seguidas no volvería al valor de
 * antes— y borra esa fila.
 *
 * `false` cuando no hay nada que deshacer.
 */
export async function deshacerAjuste<K extends ClaveAjuste>(conexion: any, clave: K): Promise<boolean> {
  const [ultima] = await conexion
    .select()
    .from(ajustesHistorial)
    .where(eq(ajustesHistorial.clave, clave))
    .orderBy(desc(ajustesHistorial.creadoEn))
    .limit(1);

  if (!ultima) return false;

  await conexion
    .insert(ajustes)
    .values({ clave, valor: ultima.valor })
    .onConflictDoUpdate({
      target: ajustes.clave,
      set: { valor: ultima.valor, actualizadoEn: new Date() },
    });

  await conexion.delete(ajustesHistorial).where(eq(ajustesHistorial.id, ultima.id));

  return true;
}

/** Vuelve una clave a su valor por defecto, dejando rastro para poder deshacerlo. */
export async function restaurarAjuste<K extends ClaveAjuste>(
  conexion: any,
  clave: K,
  actorId?: string | null
): Promise<void> {
  await escribirAjuste(conexion, clave, CLAVES[clave].porDefecto as ValorDe<K>, actorId);
}

/** Cuántas filas de historial tiene cada clave que tenga alguna. */
export async function contarHistorial(conexion: any): Promise<Record<string, number>> {
  const filas = await conexion
    .select({ clave: ajustesHistorial.clave, total: sql<number>`count(*)` })
    .from(ajustesHistorial)
    .groupBy(ajustesHistorial.clave);

  return Object.fromEntries(filas.map((f: { clave: string; total: number | string }) => [f.clave, Number(f.total)]));
}

export type TodosLosAjustes = { [K in ClaveAjuste]: ValorDe<K> };

/**
 * Rellena con el valor por defecto toda clave que falte en un mapa de ajustes.
 *
 * Existe por la caché: `leerAjustes` guarda el objeto entero con
 * `unstable_cache` y **sin caducidad**, así que una entrada escrita antes de
 * que el código estrenara una clave nueva sigue viva sin ella. Sin este relleno,
 * el primer componente que lea la clave nueva recibe `undefined` y tumba la
 * página con un 500 —el tipo dice `string`, pero en tiempo de ejecución no
 * está—. Con él, una clave recién añadida simplemente sale con su valor por
 * defecto hasta que la caché rote.
 */
export function conPorDefecto(parciales: Partial<TodosLosAjustes>): TodosLosAjustes {
  const claves = Object.keys(CLAVES) as ClaveAjuste[];
  return Object.fromEntries(
    claves.map((clave) => [
      clave,
      parciales[clave] === undefined ? CLAVES[clave].porDefecto : parciales[clave],
    ])
  ) as TodosLosAjustes;
}

export async function consultarAjustes(conexion: any): Promise<TodosLosAjustes> {
  const claves = Object.keys(CLAVES) as ClaveAjuste[];
  const valores = await Promise.all(claves.map((clave) => consultarAjuste(conexion, clave)));

  return Object.fromEntries(
    claves.map((clave, i) => [clave, valores[i]])
  ) as TodosLosAjustes;
}
