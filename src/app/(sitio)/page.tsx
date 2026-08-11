import type { Metadata } from "next";
import Hero from "@/components/campana/Hero";
import Perfil from "@/components/campana/Perfil";
import Valores from "@/components/campana/Valores";
import Agenda from "@/components/campana/Agenda";
import PlanDeGobierno from "@/components/campana/PlanDeGobierno";
import TeEscuchamos from "@/components/campana/TeEscuchamos";
import Proyectos from "@/components/campana/Proyectos";
import FranjaCifras from "@/components/campana/FranjaCifras";
import ConstructionScreen from "@/components/home/ConstructionScreen";
import { listarPublicados } from "@/lib/contenidos/cacheadas";
import { aEje, aEvento, aProyecto } from "@/lib/contenidos/adaptadores";
import { leerAjustes } from "@/lib/ajustes/cacheadas";

export const metadata: Metadata = {
  title: "Gallón Gobernador — A paso firme por Antioquia",
  description:
    "Construyendo una Antioquia más fuerte, conectada y con oportunidades para todos. Conoce el plan de gobierno, la agenda y los proyectos de Horacio Gallón.",
};

export default async function Home() {
  const ajustes = await leerAjustes();

  // El modo construcción se enciende y se apaga desde el panel, en
  // Ajustes → Estado del sitio. Ya no es una constante que haya que desplegar.
  if (ajustes["sitio.enConstruccion"]) {
    return <ConstructionScreen mensaje={ajustes["sitio.mensajeConstruccion"]} />;
  }

  const [eventos, ejes, proyectos] = await Promise.all([
    listarPublicados("evento"),
    listarPublicados("eje"),
    listarPublicados("proyecto"),
  ]);

  // La agenda solo muestra lo que todavía no ha pasado; un acto de la semana
  // pasada en la portada envejece la campaña.
  const hoy = new Date().toISOString().slice(0, 10);
  const proximos = eventos.filter((e) => e.fecha >= hoy).map(aEvento);

  return (
    <>
      <Hero subtitulo={ajustes["campana.subtituloHero"]} />
      <Perfil frase={ajustes["campana.frasePerfil"]} />
      <Valores />

      <section className="grid lg:grid-cols-2" aria-label="Agenda y plan de gobierno">
        <Agenda eventos={proximos} />
        <PlanDeGobierno ejes={ejes.map(aEje)} />
      </section>

      <TeEscuchamos municipios={ajustes["campana.municipios"]} />
      <Proyectos proyectos={proyectos.slice(0, 4).map(aProyecto)} />
      <FranjaCifras
        cifras={ajustes["portada.cifras"]}
        mensaje={ajustes["campana.mensajeCierre"]}
      />
    </>
  );
}
