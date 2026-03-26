import type { Metadata } from "next";
import SobreContent from "./content";

export const metadata: Metadata = {
  title: "Sobre Horacio Gallón — Constructor de caminos para Antioquia",
  description:
    "Hijo de Andes. Servidor público. Constructor de caminos. Más de tres décadas al servicio de Antioquia.",
};

export default function SobrePage() {
  return <SobreContent />;
}
