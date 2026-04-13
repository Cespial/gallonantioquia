import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import QuickNavBar from "@/components/home/QuickNavBar";
import SectionGrid from "@/components/home/SectionGrid";
import FeaturedReflection from "@/components/home/FeaturedReflection";
import PhotoBand from "@/components/home/PhotoBand";
import StoriesSection from "@/components/home/StoriesSection";
import SobreSection from "@/components/home/SobreSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Gallón Memorias — Memorias de Antioquia",
  description:
    "Memorias, reflexiones y conversaciones sobre Antioquia. Columnas, historias, ideas y diálogos desde el territorio.",
};

export default function Home() {
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
      <div className="section-divider max-w-5xl mx-auto" />
      <FeaturedReflection />
      <PhotoBand />
      <div className="section-divider max-w-5xl mx-auto" />
      <StoriesSection />
      <SobreSection />
      <NewsletterSection />
    </>
  );
}
