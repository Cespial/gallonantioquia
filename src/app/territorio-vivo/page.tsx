import type { Metadata } from "next";
import TerritorioVivoContent from "./content";

export const metadata: Metadata = {
  title: "Territorio Vivo — Historias de una Antioquia que se transforma",
  description:
    "Historias humanas de infraestructura, desarrollo y comunidad en Antioquia.",
};

export default function TerritorioVivoPage() {
  return <TerritorioVivoContent />;
}
