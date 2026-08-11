import type { Metadata } from "next";
import ParticipaContent from "./content";

export const metadata: Metadata = {
  title: "Participa — Quiero escucharte",
  description: "Cuéntame tu idea, propón un tema o comparte la historia de tu comunidad.",
};

export default function ParticipaPage() {
  return <ParticipaContent />;
}
