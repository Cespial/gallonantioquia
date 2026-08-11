import { describe, it, expect } from "vitest";
import { construirSitemap, BASE_URL } from "@/lib/publico/sitemap";

const entradas = [
  { slug: "a", fecha: "2026-03-01", rutaPublica: "/columnas" },
  { slug: "b", fecha: "2026-01-15", rutaPublica: "/bitacora" },
];

describe("sitemap", () => {
  it("incluye las páginas fijas del sitio", () => {
    const urls = construirSitemap([]).map((e) => e.url);
    expect(urls).toContain(BASE_URL);
    expect(urls).toContain(`${BASE_URL}/columnas`);
    expect(urls).toContain(`${BASE_URL}/sobre`);
  });

  it("agrega una entrada por contenido publicado, con su ruta de sección", () => {
    const urls = construirSitemap(entradas).map((e) => e.url);
    expect(urls).toContain(`${BASE_URL}/columnas/a`);
    expect(urls).toContain(`${BASE_URL}/bitacora/b`);
  });

  it("usa la fecha del contenido como última modificación", () => {
    const entrada = construirSitemap(entradas).find(
      (e) => e.url === `${BASE_URL}/columnas/a`
    );
    expect(entrada?.lastModified).toEqual(new Date("2026-03-01"));
  });

  it("no repite una URL aunque el contenido llegue duplicado", () => {
    const urls = construirSitemap([...entradas, entradas[0]]).map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("nunca emite una URL con doble barra", () => {
    for (const entrada of construirSitemap(entradas)) {
      expect(entrada.url.replace("https://", "")).not.toContain("//");
    }
  });
});
