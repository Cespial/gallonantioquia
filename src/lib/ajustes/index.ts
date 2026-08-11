import { eq } from "drizzle-orm";
import { ajustes } from "@/db/esquema";
import { CLAVES, type ClaveAjuste, type ValorDe } from "./claves";

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
  valor: ValorDe<K>
): Promise<void> {
  // Aquí sí lanza: escribir basura es un error de quien llama, no un dato
  // heredado que haya que tolerar.
  const limpio = CLAVES[clave].esquema.parse(valor);

  await conexion
    .insert(ajustes)
    .values({ clave, valor: limpio })
    .onConflictDoUpdate({
      target: ajustes.clave,
      set: { valor: limpio, actualizadoEn: new Date() },
    });
}

export type TodosLosAjustes = { [K in ClaveAjuste]: ValorDe<K> };

export async function consultarAjustes(conexion: any): Promise<TodosLosAjustes> {
  const claves = Object.keys(CLAVES) as ClaveAjuste[];
  const valores = await Promise.all(claves.map((clave) => consultarAjuste(conexion, clave)));

  return Object.fromEntries(
    claves.map((clave, i) => [clave, valores[i]])
  ) as TodosLosAjustes;
}
