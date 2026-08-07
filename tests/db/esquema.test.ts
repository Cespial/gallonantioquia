import { describe, it, expect } from "vitest";
import { eq, sql } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { usuarios, contenidos } from "@/db/esquema";

describe("esquema", () => {
  it("crea un usuario con rol editor por defecto", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [fila] = await db
      .insert(usuarios)
      .values({ email: "diego@campana.co", nombre: "Diego", passwordHash: "x" })
      .returning();

    expect(fila.rol).toBe("editor");
    expect(fila.activo).toBe(true);
    expect(fila.id).toMatch(/^[0-9a-f-]{36}$/);
    await cerrar();
  });

  it("rechaza dos contenidos del mismo tipo con el mismo slug", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const base = { tipo: "columna" as const, slug: "puerto-pisisi", titulo: "Puerto Pisisí", fecha: "2026-01-10" };

    await db.insert(contenidos).values(base);
    await expect(db.insert(contenidos).values(base)).rejects.toThrow();
    await cerrar();
  });

  it("permite reusar el slug si el anterior está borrado", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const base = { tipo: "columna" as const, slug: "puerto-pisisi", titulo: "Puerto Pisisí", fecha: "2026-01-10" };

    const [primero] = await db.insert(contenidos).values(base).returning();
    await db
      .update(contenidos)
      .set({ eliminadoEn: new Date() })
      .where(eq(contenidos.id, primero.id));

    const [segundo] = await db.insert(contenidos).values(base).returning();
    expect(segundo.id).not.toBe(primero.id);
    await cerrar();
  });

  it("permite el mismo slug en tipos distintos", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await db.insert(contenidos).values({ tipo: "columna", slug: "hacer-lo-impensable", titulo: "A", fecha: "2026-01-10" });
    await db.insert(contenidos).values({ tipo: "bitacora", slug: "hacer-lo-impensable", titulo: "B", fecha: "2026-01-10" });

    const filas = await db.select().from(contenidos);
    expect(filas).toHaveLength(2);
    await cerrar();
  });

  it("guarda y devuelve el campo extra como objeto", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [fila] = await db
      .insert(contenidos)
      .values({
        tipo: "columna",
        slug: "x",
        titulo: "X",
        fecha: "2026-01-10",
        extra: { sourceUrl: "https://alponiente.com/x/", readTime: "5 min" },
      })
      .returning();

    expect(fila.extra).toEqual({ sourceUrl: "https://alponiente.com/x/", readTime: "5 min" });
    await cerrar();
  });
});
