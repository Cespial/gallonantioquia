import type { Metadata } from "next";
import BitacoraContent from "./content";

export const metadata: Metadata = {
  title: "Bitácora de Camino — Reflexiones de Horacio Gallón",
  description:
    "Reflexiones personales sobre liderazgo, servicio público y territorio.",
};

export default function BitacoraPage() {
  return <BitacoraContent />;
}
