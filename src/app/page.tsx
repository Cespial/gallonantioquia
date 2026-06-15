import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import QuickNavBar from "@/components/home/QuickNavBar";
import SectionGrid from "@/components/home/SectionGrid";
import PhotoBand from "@/components/home/PhotoBand";
import SobreSection from "@/components/home/SobreSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ConstructionScreen from "@/components/home/ConstructionScreen";

// ── "En construcción" ──────────────────────────────────────────────
// Pon esto en `false` (o borra esta constante y el bloque de abajo)
// para que la página principal vuelva a mostrarse normal.
const UNDER_CONSTRUCTION = true;

export const metadata: Metadata = {
  title: "Gallón Memorias — Memorias de Antioquia",
  description:
    "Memorias, reflexiones y conversaciones sobre Antioquia. Columnas, historias, ideas y diálogos desde el territorio.",
};

export default function Home() {
  if (UNDER_CONSTRUCTION) {
    return <ConstructionScreen />;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Gallón Memorias",
            url: "https://gallonantioquia.vercel.app",
            description:
              "Memorias, reflexiones y conversaciones sobre Antioquia.",
            author: {
              "@type": "Person",
              name: "Luis Horacio Gallón Arango",
              description: "Andino. Más de 35 años al servicio de Antioquia.",
            },
          }),
        }}
      />

      <HeroSection />
      <QuickNavBar />
      <SectionGrid />
      <PhotoBand />
      <SobreSection />
      <NewsletterSection />
    </>
  );
}
