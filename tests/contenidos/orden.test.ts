import { describe, it, expect } from "vitest";
import { asc, eq, isNull } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { contenidos } from "@/db/esquema";
import { intercambiarOrden } from "@/lib/contenidos/operaciones";

async function sembrarIdeas() {
  const ctx = await crearDbPrueba();
  await ctx.db.insert(contenidos).values([
    { tipo: "idea", slug: "a", titulo: "A", fecha: "2026-01-01", orden: 0 },
    { tipo: "idea", slug: "b", titulo: "B", fecha: "2026-01-01", orden: 1 },
    { tipo: "idea", slug: "c", titulo: "C", fecha: "2026-01-01", orden: 2 },
  ]);
  return ctx;
}

async function slugsEnOrden(db: any) {
  const filas = await db.select().from(contenidos).orderBy(asc(contenidos.orden));
  return filas.map((f: any) => f.slug);
}

describe("reordenamiento", () => {
  it("sube un elemento intercambiándolo con el anterior", async () => {
    const { db, cerrar } = await sembrarIdeas();
    const [b] = await db.select().from(contenidos).where(eq(contenidos.slug, "b"));

    await intercambiarOrden(db, b.id, "arriba");
    expect(await slugsEnOrden(db)).toEqual(["b", "a", "c"]);
    await cerrar();
  });

  it("baja un elemento intercambiándolo con el siguiente", async () => {
    const { db, cerrar } = await sembrarIdeas();
    const [b] = await db.select().from(contenidos).where(eq(contenidos.slug, "b"));

    await intercambiarOrden(db, b.id, "abajo");
    expect(await slugsEnOrden(db)).toEqual(["a", "c", "b"]);
    await cerrar();
  });

  it("no hace nada si ya está en el extremo", async () => {
    const { db, cerrar } = await sembrarIdeas();
    const [a] = await db.select().from(contenidos).where(eq(contenidos.slug, "a"));

    await intercambiarOrden(db, a.id, "arriba");
    expect(await slugsEnOrden(db)).toEqual(["a", "b", "c"]);
    await cerrar();
  });

  it("ignora los borrados al buscar el vecino", async () => {
    const { db, cerrar } = await sembrarIdeas();
    await db.update(contenidos).set({ eliminadoEn: new Date() }).where(eq(contenidos.slug, "b"));
    const [c] = await db.select().from(contenidos).where(eq(contenidos.slug, "c"));

    await intercambiarOrden(db, c.id, "arriba");
    const vivos = await db
      .select()
      .from(contenidos)
      .where(isNull(contenidos.eliminadoEn))
      .orderBy(asc(contenidos.orden));
    expect(vivos.map((f: any) => f.slug)).toEqual(["c", "a"]);
    await cerrar();
  });
});
