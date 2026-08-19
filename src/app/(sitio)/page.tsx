import type { Metadata } from "next";
import Hero from "@/components/campana/Hero";
import Perfil from "@/components/campana/Perfil";
import AsiConectamos from "@/components/campana/AsiConectamos";
import SumamosEsfuerzos from "@/components/campana/SumamosEsfuerzos";
import MosaicoObras from "@/components/campana/MosaicoObras";
import Caracter from "@/components/campana/Caracter";
import FotoEquipo from "@/components/campana/FotoEquipo";
import FranjaCifras from "@/components/campana/FranjaCifras";
import { leerAjustes } from "@/lib/ajustes/cacheadas";

export const metadata: Metadata = {
  title: "Gallón Gobernador — A paso firme por Antioquia",
  description:
    "Antioquia es una tierra que, como el mejor café, exige paciencia, dedicación y trabajo bien hecho. Conoce a Horacio Gallón y las obras que conectan al departamento.",
};

/**
 * La portada es la landing del mockup: una sola página, sin bloques de
 * contenido administrado. La agenda, el plan de gobierno y los proyectos
 * siguen publicándose desde el panel, pero viven en sus propias rutas y se
 * alcanzan desde el pie.
 */
export default async function Home() {
  const ajustes = await leerAjustes();

  return (
    <>
      <Hero subtitulo={ajustes["campana.subtituloHero"]} />
      <Perfil frase={ajustes["campana.frasePerfil"]} />
      <AsiConectamos />
      <SumamosEsfuerzos />
      <MosaicoObras />
      <Caracter />
      <FotoEquipo />
      <FranjaCifras
        cifras={ajustes["portada.cifras"]}
        mensaje={ajustes["campana.mensajeCierre"]}
      />
    </>
  );
}
