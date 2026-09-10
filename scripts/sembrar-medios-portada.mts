/**
 * Da de alta en la biblioteca de medios (`medios`) las fotos que ya se usan
 * hoy en la portada, para que el panel las ofrezca al elegir foto sin que
 * nadie tenga que volver a subirlas a mano.
 *
 * Idempotente por `url` (`sembrarMediosPortada` usa `onConflictDoNothing`):
 * correrlo varias veces no duplica nada.
 *
 *   npx tsx --env-file=.env.local scripts/sembrar-medios-portada.mts            → simulacro
 *   npx tsx --env-file=.env.local scripts/sembrar-medios-portada.mts --aplicar  → guarda
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { inArray } from "drizzle-orm";
import * as esquema from "@/db/esquema";
import { MEDIOS_PORTADA, sembrarMediosPortada } from "@/lib/medios/semilla-portada";

neonConfig.webSocketConstructor = WebSocket;

const aplicar = process.argv.includes("--aplicar");

async function principal() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema: esquema });

  const urls = MEDIOS_PORTADA.map((foto) => foto.url);
  const existentes = await db
    .select({ url: esquema.medios.url })
    .from(esquema.medios)
    .where(inArray(esquema.medios.url, urls));
  const yaEstan = new Set(existentes.map((f) => f.url));
  const faltan = MEDIOS_PORTADA.filter((foto) => !yaEstan.has(foto.url));

  if (faltan.length === 0) {
    console.log(`Las ${MEDIOS_PORTADA.length} foto(s) de la portada ya están en la biblioteca. Nada que hacer.`);
  } else {
    console.log(`Faltan ${faltan.length} de ${MEDIOS_PORTADA.length} foto(s):`);
    for (const foto of faltan) console.log(`  · ${foto.nombre}  (${foto.url})`);

    if (aplicar) {
      const insertadas = await sembrarMediosPortada(db);
      console.log(`\n✓ ${insertadas} foto(s) sembrada(s).`);
    } else {
      console.log("\nVuelve a correrlo con --aplicar para guardarlas.");
    }
  }

  await pool.end();
}

principal().catch((e) => {
  console.error(e);
  process.exit(1);
});
