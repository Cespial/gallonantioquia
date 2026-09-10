import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { escribirAjuste, consultarAjuste, deshacerAjuste, restaurarAjuste, contarHistorial } from "@/lib/ajustes";
import { ajustesHistorial } from "@/db/esquema";
import { CLAVES } from "@/lib/ajustes/claves";

describe("historial de ajustes", () => {
  it("escribir guarda el valor anterior; la primera escritura no tiene anterior", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.mensajeConstruccion", "uno");
    expect((await contarHistorial(db))["sitio.mensajeConstruccion"] ?? 0).toBe(0);
    await escribirAjuste(db, "sitio.mensajeConstruccion", "dos");
    expect((await contarHistorial(db))["sitio.mensajeConstruccion"]).toBe(1);
    await cerrar();
  });
  it("deshacer es una pila: vuelve al anterior sin registrar, y avisa cuando ya no hay", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.mensajeConstruccion", "uno");
    await escribirAjuste(db, "sitio.mensajeConstruccion", "dos");
    await escribirAjuste(db, "sitio.mensajeConstruccion", "tres");
    expect(await deshacerAjuste(db, "sitio.mensajeConstruccion")).toBe(true);
    expect(await consultarAjuste(db, "sitio.mensajeConstruccion")).toBe("dos");
    expect(await deshacerAjuste(db, "sitio.mensajeConstruccion")).toBe(true);
    expect(await consultarAjuste(db, "sitio.mensajeConstruccion")).toBe("uno");
    expect(await deshacerAjuste(db, "sitio.mensajeConstruccion")).toBe(false);
    await cerrar();
  });
  it("restaurar escribe el valor por defecto y se puede deshacer", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.mensajeConstruccion", "cambiado");
    await restaurarAjuste(db, "sitio.mensajeConstruccion");
    expect(await consultarAjuste(db, "sitio.mensajeConstruccion")).toBe(CLAVES["sitio.mensajeConstruccion"].porDefecto);
    expect(await deshacerAjuste(db, "sitio.mensajeConstruccion")).toBe(true);
    expect(await consultarAjuste(db, "sitio.mensajeConstruccion")).toBe("cambiado");
    await cerrar();
  });
  it("no resucita un valor archivado que ya no pasa el esquema de hoy", async () => {
    // Un despliegue posterior puede apretar un esquema y dejar inservible lo
    // que quedó archivado. Deshacer no puede escribirlo: descarta la fila y
    // avisa que no hubo nada que deshacer.
    const { db, cerrar } = await crearDbPrueba();
    await escribirAjuste(db, "sitio.mensajeConstruccion", "el bueno");
    await db.insert(ajustesHistorial).values({ clave: "sitio.mensajeConstruccion", valor: 123 });

    expect(await deshacerAjuste(db, "sitio.mensajeConstruccion")).toBe(false);
    expect(await consultarAjuste(db, "sitio.mensajeConstruccion")).toBe("el bueno");
    // Y la fila podrida no queda estorbando en la pila.
    expect((await db.select().from(ajustesHistorial)).length).toBe(0);
    await cerrar();
  });
  it("conserva solo los 20 últimos por clave", async () => {
    const { db, cerrar } = await crearDbPrueba();
    for (let i = 0; i < 25; i++) await escribirAjuste(db, "sitio.mensajeConstruccion", `v${i}`);
    expect((await db.select().from(ajustesHistorial)).length).toBe(20);
    await cerrar();
  });
});
