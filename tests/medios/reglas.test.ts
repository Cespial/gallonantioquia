import { describe, it, expect } from "vitest";
import { crearDbPrueba } from "../ayuda/db";
import { medios, contenidos } from "@/db/esquema";
import { contarUsos, registrarMedio, validarArchivo, TAMANO_MAXIMO } from "@/lib/medios/reglas";
import { sembrarMediosPortada } from "@/lib/medios/semilla-portada";
import { escribirAjuste } from "@/lib/ajustes";
import { CLAVES_PORTADA } from "@/lib/ajustes/portada";

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

describe("uso de imágenes en los ajustes de la portada", () => {
  it("cuenta una foto referenciada desde un ajuste de la portada", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [medio] = await db.insert(medios).values({ url: "/images/z.jpg", nombre: "z.jpg", alt: "z" }).returning();
    const hero = {
      ...CLAVES_PORTADA["portada.hero"].porDefecto,
      retrato: { medioId: medio.id, url: "/images/z.jpg", alt: "z", ancho: 10, alto: 10 },
    };
    await escribirAjuste(db, "portada.hero", hero);
    expect(await contarUsos(db, medio.id)).toBe(1);
    await cerrar();
  });

  it("no cuenta un ajuste que no referencia esa foto", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [medio] = await db.insert(medios).values({ url: "/images/w.jpg", nombre: "w.jpg" }).returning();
    // Se escribe la franja por defecto (retrato con medioId nulo): no debe contar.
    await escribirAjuste(db, "portada.hero", CLAVES_PORTADA["portada.hero"].porDefecto);
    expect(await contarUsos(db, medio.id)).toBe(0);
    await cerrar();
  });

  it("suma contenidos y ajustes cuando la misma foto aparece en ambos", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const [medio] = await db.insert(medios).values({ url: "/images/v.jpg", nombre: "v.jpg" }).returning();
    await db.insert(contenidos).values({
      tipo: "columna",
      slug: "a",
      titulo: "A",
      fecha: "2026-01-01",
      imagenId: medio.id,
    });
    const equipo = { foto: { medioId: medio.id, url: "/images/v.jpg", alt: "v", ancho: 10, alto: 10 } };
    await escribirAjuste(db, "portada.equipo", equipo);
    expect(await contarUsos(db, medio.id)).toBe(2);
    await cerrar();
  });
});

describe("semilla de fotos de la portada", () => {
  it("es idempotente: siembra 13 la primera vez y 0 la segunda", async () => {
    const { db, cerrar } = await crearDbPrueba();
    expect(await sembrarMediosPortada(db)).toBe(13);
    expect(await sembrarMediosPortada(db)).toBe(0);
    await cerrar();
  });
});

describe("registrarMedio", () => {
  it("con la misma url dos veces deja una sola fila y devuelve la existente", async () => {
    // El navegador anota la subida en cuanto termina y el webhook de Blob la
    // anota otra vez después: la segunda no puede fallar ni duplicar.
    const { db, cerrar } = await crearDbPrueba();
    const url = "https://x.public.blob.vercel-storage.com/a-1.webp";
    const primera = await registrarMedio(db, { url, nombre: "a.png" });
    const segunda = await registrarMedio(db, { url, nombre: "a.png" });
    expect(segunda.id).toBe(primera.id);
    expect((await db.select().from(medios)).length).toBe(1);
    await cerrar();
  });
});
