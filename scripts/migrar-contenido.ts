import { db } from "@/db";
import { migrarContenido } from "@/lib/admin/migracion";

async function principal() {
  console.log("Migrando contenido a la base de datos…");
  const resumen = await migrarContenido(db);

  console.log("\nMedios registrados:", resumen.medios);
  console.log("Ajustes creados:", resumen.ajustes);
  console.table(resumen.porTipo);
  console.log("\nListo. Las columnas quedaron publicadas; el resto, en borrador.");
}

principal().catch((error) => {
  console.error("La migración falló y no se escribió nada:", error);
  process.exit(1);
});
