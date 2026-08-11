import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as esquema from "@/db/esquema";
import { migrarContenido } from "@/lib/admin/migracion";

// No se usa el cliente de `@/db`. Ese va sobre `neon-http`, que no soporta
// transacciones —falla con «No transactions support in neon-http driver»— y
// `migrarContenido` corre entera dentro de una, para que un fallo a medias no
// deje la base con contenido parcial. PGlite sí las soporta, así que la prueba
// pasa igual y la diferencia solo aparece contra la base real.
neonConfig.webSocketConstructor = WebSocket;

async function principal() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Falta DATABASE_URL. Corre antes: vercel env pull .env.local");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema: esquema });

  console.log("Migrando contenido a la base de datos…");
  const resumen = await migrarContenido(db);

  console.log("\nMedios registrados:", resumen.medios);
  console.log("Ajustes creados:", resumen.ajustes);
  console.table(resumen.porTipo);
  console.log("\nListo. Las columnas quedaron publicadas; el resto, en borrador.");

  await pool.end();
}

principal().catch((error) => {
  console.error("La migración falló y no se escribió nada:", error);
  process.exit(1);
});
