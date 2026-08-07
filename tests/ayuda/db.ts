import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

export type BaseDePrueba = ReturnType<typeof drizzle>;

/**
 * Levanta un Postgres en memoria, aislado, para una sola prueba.
 * En la tarea 2 se le agrega la aplicación del esquema.
 */
export async function crearDbPrueba(): Promise<{
  db: BaseDePrueba;
  cerrar: () => Promise<void>;
}> {
  const cliente = new PGlite();
  const db = drizzle(cliente);
  return { db, cerrar: () => cliente.close() };
}
