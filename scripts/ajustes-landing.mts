/**
 * Alinea los ajustes del panel con la landing del mockup: el menú pasa a las
 * cinco anclas de la portada y los textos del hero y del perfil toman la
 * redacción del diseño.
 *
 * CUÁNDO CORRERLO: **antes** de desplegar la landing, no después. Los ajustes
 * se leen con `unstable_cache` etiquetado y sin caducidad, así que producción
 * no verá esta escritura hasta que un despliegue nuevo estrene la caché. Al
 * escribir primero y desplegar después, el código nuevo y los textos nuevos
 * aparecen juntos y la portada vieja nunca llega a mostrar anclas que no
 * existen. (Si alguien guarda algo en el panel en ese intervalo, se revalida la
 * etiqueta y el menú nuevo saldría antes de tiempo: molesto, no grave.)
 *
 *   npx tsx scripts/ajustes-landing.mts            → simulacro, no escribe
 *   npx tsx scripts/ajustes-landing.mts --aplicar  → guarda
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
    { etiqueta: "Contacto", destino: "/contacto", visible: true },
  ],
  "campana.subtituloHero":
    "una tierra que, como el mejor café, exige paciencia, dedicación y trabajo bien hecho como lo venimos haciendo.",
  // Los dobles asteriscos los vuelve negrita el helper `resaltar`.
  "campana.frasePerfil":
    "Todo **gran futuro** comienza sembrando una **buena semilla**.",
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
      // `escribirAjuste` valida contra el esquema Zod de la clave: si la forma
      // no cuadra, revienta aquí y no deja el panel con un valor inservible.
      await escribirAjuste(db, clave as ClaveAjuste, valor as never);
      console.log("  ✓ aplicado");
    }
  }

  console.log(
    cambios === 0
      ? "\nNada que cambiar."
      : aplicar
        ? `\n${cambios} ajuste(s) guardados. Ahora sí: desplegar.`
        : `\nSimulacro: ${cambios} ajuste(s) cambiarían. Añade --aplicar para guardar.`
  );
  await pool.end();
}

principal().catch((e) => {
  console.error("Falló la actualización de ajustes:", e);
  process.exit(1);
});
