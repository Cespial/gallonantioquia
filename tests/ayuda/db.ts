import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as esquema from "@/db/esquema";

export type BaseDePrueba = ReturnType<typeof drizzle<typeof esquema>>;

/** Levanta un Postgres en memoria con el esquema ya aplicado. */
export async function crearDbPrueba(): Promise<{
  db: BaseDePrueba;
  cerrar: () => Promise<void>;
}> {
  const cliente = new PGlite();
  const db = drizzle(cliente, { schema: esquema });
  await migrate(db, { migrationsFolder: "./src/db/migraciones" });
  return { db, cerrar: () => cliente.close() };
}
