import type { Metadata } from "next";
import TituloPagina from "@/components/campana/TituloPagina";
import Proyectos from "@/components/campana/Proyectos";
import { listarPublicados } from "@/lib/contenidos/cacheadas";
import { aProyecto } from "@/lib/contenidos/adaptadores";

export const metadata: Metadata = {
  title: "Proyectos Destacados — Gallón Gobernador",
  description: "Los proyectos con los que trabajamos por una Antioquia conectada.",
};

export default async function PaginaProyectos() {
  const proyectos = (await listarPublicados("proyecto")).map(aProyecto);

  return (
    <>
      <TituloPagina
        arriba="Proyectos"
        abajo="Destacados"
        descripcion="Obras y programas que conectan a las subregiones con el resto del departamento."
      />
      <Proyectos proyectos={proyectos} />
    </>
  );
}
