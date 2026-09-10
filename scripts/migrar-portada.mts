/**
 * Migra el copy que el equipo dejó guardado en las claves legadas de la
 * campaña (`campana.subtituloHero`, `campana.frasePerfil`,
 * `campana.mensajeCierre`, `campana.videoPerfil`, `campana.podcast`, el
 * arreglo `portada.cifras`) hacia las franjas nuevas de `portada.*`. Es
 * idempotente: una franja que ya tiene fila propia no se toca, así que
 * correrlo de más no hace daño.
 *
 * CUÁNDO CORRERLO: antes de la Task 12, que retira esas claves legadas de
 * `CLAVES` —después de eso ya no habría nada que leer.
 *
 *   npx tsx --env-file=.env.local scripts/migrar-portada.mts            → simulacro
 *   npx tsx --env-file=.env.local scripts/migrar-portada.mts --aplicar  → guarda
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as esquema from "@/db/esquema";
import { migrarPortada } from "@/lib/ajustes/migracion-portada";

neonConfig.webSocketConstructor = WebSocket;

const aplicar = process.argv.includes("--aplicar");

async function principal() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema: esquema });

  const resultado = await migrarPortada(db, aplicar);

  for (const r of resultado) {
    console.log(`· ${r.clave}  (desde ${r.desde}): ${r.accion}`);
  }

  const copiados = resultado.filter((r) => r.accion === "copiado").length;
  const invalidos = resultado.filter((r) => r.accion === "legado inválido").length;

  await pool.end();

  if (copiados === 0) {
    console.log("\nNada que copiar.");
  } else if (!aplicar) {
    console.log(`\n${copiados} campo(s) por copiar. Vuelve a correrlo con --aplicar para guardarlos.`);
  } else {
    console.log(`\n${copiados} campo(s) copiado(s).`);
  }
  if (invalidos > 0) {
    console.log(`⚠ ${invalidos} legado(s) no pasaron el esquema nuevo y no se copiaron.`);
  }
}

principal().catch((e) => {
  console.error(e);
  process.exit(1);
});
