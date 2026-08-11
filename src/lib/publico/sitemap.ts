import type { MetadataRoute } from "next";

export const BASE_URL = "https://gallonantioquia.vercel.app";

export interface EntradaSitemap {
  slug: string;
  fecha: string;
  /** La ruta de la sección, tal como la declara ConfigTipo: "/columnas". */
  rutaPublica: string;
}

/** Pura, para poder probarla sin base de datos ni Next. */
export function construirSitemap(entradas: EntradaSitemap[]): MetadataRoute.Sitemap {
  const fijas: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${BASE_URL}/columnas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const vistas = new Set(fijas.map((f) => f.url));
  const dinamicas: MetadataRoute.Sitemap = [];

  for (const entrada of entradas) {
    const url = `${BASE_URL}${entrada.rutaPublica}/${entrada.slug}`;
    // Un mismo slug puede llegar dos veces si algo se duplica aguas arriba;
    // repetir la URL en el sitemap es una señal de error para los buscadores.
    if (vistas.has(url)) continue;

    vistas.add(url);
    dinamicas.push({
      url,
      lastModified: new Date(entrada.fecha),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return [...fijas, ...dinamicas];
}
