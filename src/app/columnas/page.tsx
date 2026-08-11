import type { Metadata } from "next";
import ColumnasContent from "./content";
import { listarPublicados } from "@/lib/contenidos/cacheadas";
import { aColumna } from "@/lib/contenidos/adaptadores";

export const metadata: Metadata = {
  title: "Columnas — Opinión en Al Poniente",
  description:
    "Columnas de opinión publicadas en Al Poniente. Reflexiones sobre Antioquia, competitividad, infraestructura y sociedad.",
};

export default async function ColumnasPage() {
  const columnas = (await listarPublicados("columna")).map(aColumna);
  return <ColumnasContent columnas={columnas} />;
}
