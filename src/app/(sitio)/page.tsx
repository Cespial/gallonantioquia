import type { Metadata } from "next";
import Hero from "@/components/campana/Hero";
import Perfil from "@/components/campana/Perfil";
import VideoPerfil from "@/components/campana/VideoPerfil";
import AsiConectamos from "@/components/campana/AsiConectamos";
import SumamosEsfuerzos from "@/components/campana/SumamosEsfuerzos";
import MosaicoObras from "@/components/campana/MosaicoObras";
import Caracter from "@/components/campana/Caracter";
import CafeGallon from "@/components/campana/CafeGallon";
import BlogGallon from "@/components/campana/BlogGallon";
import Podcast from "@/components/campana/Podcast";
import FotoEquipo from "@/components/campana/FotoEquipo";
import FranjaCifras from "@/components/campana/FranjaCifras";
import { leerAjustes } from "@/lib/ajustes/cacheadas";
import { listarPublicados } from "@/lib/contenidos/cacheadas";

export const metadata: Metadata = {
  title: "Gallón Gobernador — A paso firme por Antioquia",
  description:
    "Antioquia es una tierra que, como el mejor café, exige paciencia, dedicación y trabajo bien hecho. Conoce a Horacio Gallón y las obras que conectan al departamento.",
};

/**
 * La portada es la landing del mockup ampliada con las secciones propias de la
 * campaña —video, Café Gallón, blog y podcast—, cada una encabezada por su
 * pieza gráfica. La agenda, el plan de gobierno y los proyectos siguen
 * publicándose desde el panel, pero viven en sus propias rutas y se alcanzan
 * desde el pie.
 *
 * ⚠️ El orden de las tres últimas franjas no es negociable: `FotoEquipo` lleva
 * un degradado que arranca en blanco y termina en el verde de `FranjaCifras`,
 * así que necesita una sección clara encima y la franja de cifras justo debajo.
 */
export default async function Home() {
  const [ajustes, columnas] = await Promise.all([
    leerAjustes(),
    listarPublicados("columna"),
  ]);

  const entradasBlog = columnas.slice(0, 3).map((c) => ({
    slug: c.slug,
    titulo: c.titulo,
    resumen: c.resumen ?? "",
    fecha: c.fecha,
    minutos: typeof c.extra.readTime === "string" ? c.extra.readTime : "",
  }));

  return (
    <>
      <Hero subtitulo={ajustes["campana.subtituloHero"]} />
      <Perfil frase={ajustes["campana.frasePerfil"]} />
      <VideoPerfil url={ajustes["campana.videoPerfil"]} />
      <AsiConectamos />
      <SumamosEsfuerzos />
      <MosaicoObras />
      <Caracter />
      <CafeGallon />
      <BlogGallon entradas={entradasBlog} />
      <Podcast url={ajustes["campana.podcast"]} />
      <FotoEquipo />
      <FranjaCifras
        cifras={ajustes["portada.cifras"]}
        mensaje={ajustes["campana.mensajeCierre"]}
      />
    </>
  );
}
