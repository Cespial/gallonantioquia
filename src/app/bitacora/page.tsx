import type { Metadata } from "next";
import BitacoraContent from "./content";

export const metadata: Metadata = {
  title: "Bitácora de Camino — Mis reflexiones",
  description:
    "Reflexiones personales sobre liderazgo, servicio público y lo que me enseña recorrer Antioquia.",
};

export default function BitacoraPage() {
  return <BitacoraContent />;
}
