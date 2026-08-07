import { describe, it, expect } from "vitest";
import { and, eq, isNull } from "drizzle-orm";
import { crearDbPrueba } from "../ayuda/db";
import { contenidos, medios, ajustes } from "@/db/esquema";
import { migrarContenido } from "@/lib/admin/migracion";
import { columnasBodies } from "@/data/columnas-bodies";

/**
 * Devuelve el texto que el lector vería, con los párrafos separados por saltos.
 * Deshace el escapado de entidades que aplica `sanitize-html`, para poder
 * comparar contra la fuente sin falsos negativos por `&`, comillas o `<`.
 */
function textoPlano(html: string): string {
  return html
    .replace(/<\/p><p>/g, "\n")
    .replace(/<\/?p>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

describe("migración del contenido existente", () => {
  it("migra las cantidades exactas del spec", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const resumen = await migrarContenido(db);

    expect(resumen.porTipo).toEqual({
      columna: 32,
      bitacora: 5,
      historia: 6,
      idea: 6,
      voz: 4,
      episodio: 4,
    });
    await cerrar();
  });

  it("deja las 32 columnas publicadas y todo lo demás en borrador", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const publicados = await db.select().from(contenidos).where(eq(contenidos.estado, "publicado"));
    expect(publicados).toHaveLength(32);
    expect(publicados.every((c) => c.tipo === "columna")).toBe(true);

    const borradores = await db.select().from(contenidos).where(eq(contenidos.estado, "borrador"));
    expect(borradores).toHaveLength(25);
    await cerrar();
  });

  it("conserva el sourceUrl y el cuerpo de cada columna", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const [col] = await db
      .select()
      .from(contenidos)
      .where(and(eq(contenidos.tipo, "columna"), eq(contenidos.slug, "puerto-pisisi-ahora-si")));

    expect(col.extra).toHaveProperty("sourceUrl");
    expect(String(col.extra.sourceUrl)).toContain("alponiente.com");
    expect(col.cuerpoHtml).toMatch(/^<p>/);
    await cerrar();
  });

  it("convierte cada párrafo del cuerpo en un <p>", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const todas = await db.select().from(contenidos).where(eq(contenidos.tipo, "columna"));
    for (const col of todas) {
      expect(col.cuerpoHtml, `la columna ${col.slug} quedó sin cuerpo`).toBeTruthy();
      expect(col.cuerpoHtml!.startsWith("<p>")).toBe(true);
      expect(col.cuerpoHtml).not.toContain("<script");
    }
    await cerrar();
  });

  it("conserva íntegro el texto de las 32 columnas, párrafo por párrafo", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const todas = await db.select().from(contenidos).where(eq(contenidos.tipo, "columna"));
    expect(todas).toHaveLength(32);

    for (const col of todas) {
      const parrafos = (columnasBodies[col.slug] ?? []).map((p) => p.trim());
      const cuerpo = col.cuerpoHtml ?? "";

      expect(
        (cuerpo.match(/<p>/g) ?? []).length,
        `${col.slug}: cambió el número de párrafos`
      ).toBe(parrafos.length);

      expect(textoPlano(cuerpo), `${col.slug}: se perdió o se alteró texto`).toBe(
        parrafos.join("\n")
      );
    }
    await cerrar();
  });

  it("registra las imágenes del repositorio sin re-subirlas", async () => {
    const { db, cerrar } = await crearDbPrueba();
    const resumen = await migrarContenido(db);

    const filas = await db.select().from(medios);
    expect(filas.length).toBe(resumen.medios);
    expect(filas.every((m) => m.url.startsWith("/images/"))).toBe(true);
    await cerrar();
  });

  it("enlaza cada contenido con su imagen de portada", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const sinImagen = await db.select().from(contenidos).where(isNull(contenidos.imagenId));
    expect(sinImagen).toHaveLength(0);
    await cerrar();
  });

  it("migra los ajustes de portada, sobre y navegación", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const filas = await db.select().from(ajustes);
    const porClave = Object.fromEntries(filas.map((f) => [f.clave, f.valor]));

    expect((porClave["portada.cifras"] as unknown[]).length).toBe(6);
    expect((porClave["sobre.trayectoria"] as unknown[]).length).toBe(10);
    expect((porClave["navegacion.menu"] as unknown[]).length).toBe(3);
    expect(porClave["sitio.enConstruccion"]).toBe(true);
    await cerrar();
  });

  it("es idempotente: correrla dos veces no duplica nada", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);
    await migrarContenido(db);

    const filasContenidos = await db.select().from(contenidos);
    expect(filasContenidos).toHaveLength(57);

    const filasMedios = await db.select().from(medios);
    expect(filasMedios).toHaveLength(23);

    const filasAjustes = await db.select().from(ajustes);
    expect(filasAjustes).toHaveLength(8);
    await cerrar();
  });

  it("los slugs migrados pasan la validación del panel", async () => {
    const { db, cerrar } = await crearDbPrueba();
    await migrarContenido(db);

    const filas = await db.select().from(contenidos);
    for (const c of filas) {
      expect(c.slug, `slug inválido: ${c.slug}`).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
    await cerrar();
  });
});
