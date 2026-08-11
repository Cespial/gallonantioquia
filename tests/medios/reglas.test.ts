import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { medios, contenidos } from "@/db/esquema";
import { contarUsos, validarArchivo, TAMANO_MAXIMO } from "@/lib/medios/reglas";

describe("validación de archivos", () => {
  it("acepta los formatos permitidos", () => {
    for (const tipo of ["image/jpeg", "image/png", "image/webp", "image/avif"]) {
      expect(validarArchivo({ tipo, tamano: 1024 }).ok).toBe(true);
    }
  });

  it("rechaza un PDF disfrazado de imagen", () => {
    const r = validarArchivo({ tipo: "application/pdf", tamano: 1024 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("formato");
  });

  it("rechaza un SVG, que puede llevar scripts", () => {
    expect(validarArchivo({ tipo: "image/svg+xml", tamano: 1024 }).ok).toBe(false);
  });

  it("rechaza un archivo que pasa del máximo", () => {
    const r = validarArchivo({ tipo: "image/jpeg", tamano: TAMANO_MAXIMO + 1 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("10 MB");
  });
});

describe("uso de imágenes", () => {
  it("cuenta cuántos contenidos usan una imagen", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [medio] = await db
      .insert(medios)
      .values({ url: "/images/x.jpg", nombre: "x.jpg" })
      .returning();

    await db.insert(contenidos).values([
      { tipo: "columna", slug: "a", titulo: "A", fecha: "2026-01-01", imagenId: medio.id },
      { tipo: "columna", slug: "b", titulo: "B", fecha: "2026-01-01", imagenId: medio.id },
      { tipo: "columna", slug: "c", titulo: "C", fecha: "2026-01-01" },
    ]);

    expect(await contarUsos(db, medio.id)).toBe(2);
    await cerrar();
  });

  it("no cuenta los contenidos borrados", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [medio] = await db
      .insert(medios)
      .values({ url: "/images/y.jpg", nombre: "y.jpg" })
      .returning();
    await db.insert(contenidos).values({
      tipo: "columna",
      slug: "a",
      titulo: "A",
      fecha: "2026-01-01",
      imagenId: medio.id,
      eliminadoEn: new Date(),
    });

    expect(await contarUsos(db, medio.id)).toBe(0);
    await cerrar();
  });
});
