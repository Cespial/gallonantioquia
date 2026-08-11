import type { Metadata } from "next";
import TerritorioVivoContent from "./content";
import { listarPublicados } from "@/lib/contenidos/cacheadas";
import { aHistoria } from "@/lib/contenidos/adaptadores";

export const metadata: Metadata = {
  title: "Territorio Vivo — Historias de Antioquia",
  description:
    "Historias humanas de una Antioquia que se transforma.",
};

export default async function TerritorioVivoPage() {
  const stories = (await listarPublicados("historia")).map(aHistoria);
  return <TerritorioVivoContent stories={stories} />;
}
