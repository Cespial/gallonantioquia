import { describe, it, expect } from "vitest";
import { eq } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { contenidos } from "@/db/esquema";
import { consultarBorrados } from "@/lib/contenidos/consultas";

describe("papelera", () => {
  it("lista solo lo borrado, de lo más reciente a lo más antiguo", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await db.insert(contenidos).values([
      { tipo: "columna", slug: "viva", titulo: "Viva", fecha: "2026-01-01" },
      {
        tipo: "columna",
        slug: "vieja",
        titulo: "Vieja",
        fecha: "2026-01-01",
        eliminadoEn: new Date("2026-01-01"),
      },
      {
        tipo: "bitacora",
        slug: "nueva",
        titulo: "Nueva",
        fecha: "2026-01-01",
        eliminadoEn: new Date("2026-06-01"),
      },
    ]);

    const filas = await consultarBorrados(db);
    expect(filas.map((f) => f.slug)).toEqual(["nueva", "vieja"]);
    await cerrar();
  });

  it("un contenido borrado deja libre su slug", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await db.insert(contenidos).values({
      tipo: "columna",
      slug: "repetida",
      titulo: "A",
      fecha: "2026-01-01",
      eliminadoEn: new Date(),
    });
    await db.insert(contenidos).values({
      tipo: "columna",
      slug: "repetida",
      titulo: "B",
      fecha: "2026-01-01",
    });

    const vivas = await db.select().from(contenidos).where(eq(contenidos.slug, "repetida"));
    expect(vivas).toHaveLength(2);
    await cerrar();
  });
});
