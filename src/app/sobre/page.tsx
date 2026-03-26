import type { Metadata } from "next";
import SobreContent from "./content";

export const metadata: Metadata = {
  title: "Sobre Horacio Gallon — Constructor de caminos para Antioquia",
  description:
    "Hijo de Andes. Servidor publico. Constructor de caminos. Mas de tres decadas al servicio de Antioquia.",
};

export default function SobrePage() {
  return <SobreContent />;
}
