import type { Metadata } from "next";
import ParticipaContent from "./content";

export const metadata: Metadata = {
  title: "Participa — Tu voz construye Antioquia",
  description: "Envia tu idea, propon un tema o comparte tu historia.",
};

export default function ParticipaPage() {
  return <ParticipaContent />;
}
