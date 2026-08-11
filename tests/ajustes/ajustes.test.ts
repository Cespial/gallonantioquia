import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { ajustes } from "@/db/esquema";
import { CLAVES, consultarAjuste, escribirAjuste } from "@/lib/ajustes";

describe("ajustes", () => {
  it("devuelve el valor por defecto cuando la clave no existe", async () => {
    const { db, cerrar } = await crearDbPrueba();
    expect(await consultarAjuste(db, "sitio.enConstruccion")).toBe(
      CLAVES["sitio.enConstruccion"].porDefecto
    );
    await cerrar();
  });

  it("devuelve el valor guardado", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.enConstruccion", false);
    expect(await consultarAjuste(db, "sitio.enConstruccion")).toBe(false);
    await cerrar();
  });

  it("sobrescribe en vez de duplicar", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.enConstruccion", false);
    await escribirAjuste(db, "sitio.enConstruccion", true);

    const filas = await db.select().from(ajustes);
    expect(filas).toHaveLength(1);
    expect(await consultarAjuste(db, "sitio.enConstruccion")).toBe(true);
    await cerrar();
  });

  it("rechaza un valor que no cumple el esquema de la clave", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await expect(escribirAjuste(db, "sitio.enConstruccion", "sí" as never)).rejects.toThrow();
    await cerrar();
  });

  it("cae al valor por defecto si lo guardado quedó corrupto", async () => {
    const { db, cerrar } = await crearDbPrueba();
    // Escritura directa, saltándose la validación, como si viniera de una
    // versión anterior del esquema.
    await db.insert(ajustes).values({ clave: "portada.cifras", valor: { roto: true } });

    expect(await consultarAjuste(db, "portada.cifras")).toEqual(
      CLAVES["portada.cifras"].porDefecto
    );
    await cerrar();
  });

  it("valida la forma de las cifras de portada", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "portada.cifras", [
      { valor: 35, sufijo: "+", etiqueta: "años al servicio de Antioquia" },
    ]);
    await expect(
      escribirAjuste(db, "portada.cifras", [{ valor: "treinta y cinco" }] as never)
    ).rejects.toThrow();
    await cerrar();
  });
});
