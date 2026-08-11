import type { Metadata } from "next";
import BitacoraContent from "./content";
import { listarPublicados } from "@/lib/contenidos/cacheadas";
import { aEntradaBitacora } from "@/lib/contenidos/adaptadores";

export const metadata: Metadata = {
  title: "Bitácora de Camino — Mis reflexiones",
  description:
    "Reflexiones personales sobre liderazgo, servicio público y lo que me enseña recorrer Antioquia.",
};

export default async function BitacoraPage() {
  const blogPosts = (await listarPublicados("bitacora")).map(aEntradaBitacora);
  return <BitacoraContent blogPosts={blogPosts} />;
}
