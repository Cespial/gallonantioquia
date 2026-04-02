import type { Metadata } from "next";
import SobreContent from "./content";

export const metadata: Metadata = {
  title: "Mi historia — Horacio Gallón",
  description:
    "Nací en Andes. Llevo más de treinta años caminando este departamento y construyendo caminos para Antioquia.",
};

export default function SobrePage() {
  return <SobreContent />;
}
