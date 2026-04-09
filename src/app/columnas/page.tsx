import type { Metadata } from "next";
import ColumnasContent from "./content";

export const metadata: Metadata = {
  title: "Columnas — Opinión en Al Poniente",
  description:
    "29 columnas de opinión publicadas en Al Poniente. Reflexiones sobre Antioquia, competitividad, infraestructura y sociedad.",
};

export default function ColumnasPage() {
  return <ColumnasContent />;
}
