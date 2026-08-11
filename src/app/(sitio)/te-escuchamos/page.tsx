import type { Metadata } from "next";
import TituloPagina from "@/components/campana/TituloPagina";
import TeEscuchamos from "@/components/campana/TeEscuchamos";
import { leerAjuste } from "@/lib/ajustes/cacheadas";

export const metadata: Metadata = {
  title: "Te Escuchamos — Gallón Gobernador",
  description: "Cuéntanos tu propuesta, idea o solicitud. Tu voz construye el plan de gobierno.",
};

export default async function PaginaTeEscuchamos() {
  const municipios = await leerAjuste("campana.municipios");

  return (
    <>
      <TituloPagina
        arriba="Te"
        abajo="Escuchamos"
        descripcion="Cada propuesta que llega por aquí la lee el equipo. Cuéntanos qué necesita tu municipio."
      />
      <TeEscuchamos municipios={municipios} />
    </>
  );
}
