import { describe, it, expect } from "vitest";
import { sql } from "drizzle-orm";
import { crearDbPrueba } from "./db";

describe("banco de pruebas", () => {
  it("levanta un Postgres en memoria que responde consultas", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const filas = await db.execute(sql`select 1 as uno`);
    expect(filas.rows[0]).toEqual({ uno: 1 });
    await cerrar();
  });

  it("da una base limpia en cada llamada", async () => {
    const a = await crearDbPrueba();
    await a.db.execute(sql`create table marca (id int)`);
    await a.cerrar();

    const b = await crearDbPrueba();
    const existe = await b.db.execute(
      sql`select to_regclass('public.marca') as tabla`
    );
    expect(existe.rows[0].tabla).toBeNull();
    await b.cerrar();
  });
});
