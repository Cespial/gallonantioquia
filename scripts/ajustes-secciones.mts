/**
 * Suma al menú las anclas de las secciones nuevas de la portada —Café Gallón y
 * Blog— y estrena las claves del video y del podcast con valor vacío, para que
 * aparezcan en la pestaña «Campaña» del panel desde el primer día.
 *
 * CUÁNDO CORRERLO: **antes** de desplegar, igual que `ajustes-landing.mts`.
 * Los ajustes se leen con `unstable_cache` etiquetado y sin caducidad, así que
 * producción no ve esta escritura hasta que un despliegue estrena la caché. Al
 * escribir primero y desplegar después, el menú nuevo y las secciones nuevas
 * aparecen juntos y nadie llega a ver un ancla que no existe.
 *
 *   npx tsx --env-file=.env.local scripts/ajustes-secciones.mts            → simulacro
 *   npx tsx --env-file=.env.local scripts/ajustes-secciones.mts --aplicar  → guarda
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as esquema from "@/db/esquema";
import { consultarAjuste, escribirAjuste, type ClaveAjuste } from "@/lib/ajustes";

neonConfig.webSocketConstructor = WebSocket;

const aplicar = process.argv.includes("--aplicar");

const NUEVOS = {
  "navegacion.menu": [
    { etiqueta: "Inicio", destino: "/#inicio", visible: true },
    { etiqueta: "Soy Gallón", destino: "/#soy-gallon", visible: true },
    { etiqueta: "#APasoFirmePorAntioquia", destino: "/#a-paso-firme", visible: true },
    { etiqueta: "Por Antioquia", destino: "/#por-antioquia", visible: true },
    { etiqueta: "Café Gallón", destino: "/#cafe-gallon", visible: true },
    { etiqueta: "Blog", destino: "/#blog", visible: true },
    { etiqueta: "Contacto", destino: "/contacto", visible: true },
  ],
  // Se siembran vacías a propósito: la portada ya sabe qué mostrar sin enlace,
  // y así las dos filas existen en la base cuando alguien abra el panel.
  "campana.videoPerfil": "",
  "campana.podcast": "",
} as const;

async function principal() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema: esquema });

  let cambios = 0;
  for (const [clave, valor] of Object.entries(NUEVOS)) {
    const antes = await consultarAjuste(db, clave as ClaveAjuste);
    if (JSON.stringify(antes) === JSON.stringify(valor)) {
      console.log(`· ${clave}: ya estaba al día`);
      continue;
    }

    cambios++;
    console.log(`\n${clave}`);
    console.log(`  antes:   ${JSON.stringify(antes)}`);
    console.log(`  después: ${JSON.stringify(valor)}`);

    if (aplicar) {
      await escribirAjuste(db, clave as ClaveAjuste, valor as never);
      console.log("  ✓ guardado");
    }
  }

  await pool.end();

  if (!cambios) {
    console.log("\nNada que hacer.");
  } else if (!aplicar) {
    console.log(`\n${cambios} cambio(s). Vuelve a correrlo con --aplicar para guardar.`);
  } else {
    console.log(`\n${cambios} cambio(s) guardado(s). Ahora sí: despliega.`);
  }
}

principal().catch((e) => {
  console.error(e);
  process.exit(1);
});
