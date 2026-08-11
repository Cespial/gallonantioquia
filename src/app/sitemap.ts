import type { MetadataRoute } from "next";
import { LISTA_TIPOS } from "@/lib/admin/tipos";
import { listarPublicados } from "@/lib/contenidos/cacheadas";
import { construirSitemap, type EntradaSitemap } from "@/lib/publico/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Todas las secciones, no solo columnas: lo que se publique desde el panel
  // entra al sitemap sin que nadie tenga que acordarse de agregarlo.
  const porTipo = await Promise.all(
    LISTA_TIPOS.map(async (config) => {
      const filas = await listarPublicados(config.tipo);
      return filas.map<EntradaSitemap>((fila) => ({
        slug: fila.slug,
        fecha: fila.fecha,
        rutaPublica: config.rutaPublica,
      }));
    })
  );

  return construirSitemap(porTipo.flat());
}
