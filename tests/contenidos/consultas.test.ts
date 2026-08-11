import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { contenidos } from "@/db/esquema";
import { etiquetaDe, consultarPublicados, consultarPublicado } from "@/lib/contenidos/consultas";

async function sembrar() {
  const ctx = await crearDbPrueba();
  await ctx.db.insert(contenidos).values([
    { tipo: "columna", slug: "a", titulo: "A", fecha: "2026-03-01", estado: "publicado" },
    { tipo: "columna", slug: "b", titulo: "B", fecha: "2026-01-01", estado: "publicado" },
    { tipo: "columna", slug: "c", titulo: "C", fecha: "2026-02-01", estado: "borrador" },
    {
      tipo: "columna",
      slug: "d",
      titulo: "D",
      fecha: "2026-04-01",
      estado: "publicado",
      eliminadoEn: new Date(),
    },
    { tipo: "idea", slug: "i1", titulo: "I1", fecha: "2026-01-01", estado: "publicado", orden: 2 },
    { tipo: "idea", slug: "i2", titulo: "I2", fecha: "2026-01-01", estado: "publicado", orden: 1 },
  ]);
  return ctx;
}

describe("consultas públicas", () => {
  it("nombra las etiquetas de caché por tipo", () => {
    expect(etiquetaDe("columna")).toBe("contenido:columna");
    expect(etiquetaDe("episodio")).toBe("contenido:episodio");
  });

  it("devuelve solo lo publicado y no borrado", async () => {
    const { db, cerrar } = await sembrar();
    const filas = await consultarPublicados(db, "columna");
    expect(filas.map((f) => f.slug)).toEqual(["a", "b"]);
    await cerrar();
  });

  it("ordena las columnas por fecha descendente", async () => {
    const { db, cerrar } = await sembrar();
    const filas = await consultarPublicados(db, "columna");
    expect(filas[0].slug).toBe("a");
    await cerrar();
  });

  it("ordena las ideas por el campo orden", async () => {
    const { db, cerrar } = await sembrar();
    const filas = await consultarPublicados(db, "idea");
    expect(filas.map((f) => f.slug)).toEqual(["i2", "i1"]);
    await cerrar();
  });

  it("ordena la agenda del evento más próximo al más lejano", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await db.insert(contenidos).values([
      { tipo: "evento", slug: "e3", titulo: "E3", fecha: "2026-10-26", estado: "publicado" },
      { tipo: "evento", slug: "e1", titulo: "E1", fecha: "2026-10-24", estado: "publicado" },
      { tipo: "evento", slug: "e2", titulo: "E2", fecha: "2026-10-25", estado: "publicado" },
    ]);

    // Al contrario que las columnas, que van de la más nueva a la más vieja.
    const filas = await consultarPublicados(db, "evento");
    expect(filas.map((f) => f.slug)).toEqual(["e1", "e2", "e3"]);
    await cerrar();
  });

  it("obtiene uno por slug y devuelve null si es borrador", async () => {
    const { db, cerrar } = await sembrar();
    expect((await consultarPublicado(db, "columna", "a"))?.titulo).toBe("A");
    expect(await consultarPublicado(db, "columna", "c")).toBeNull();
    expect(await consultarPublicado(db, "columna", "d")).toBeNull();
    await cerrar();
  });
});
