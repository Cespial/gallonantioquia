import type { Metadata } from "next";
import { Coffee } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import FadeIn from "@/components/animations/FadeIn";
import EpisodeCard from "@/components/content/EpisodeCard";
import { episodes } from "@/data/content";

export const metadata: Metadata = {
  title: "Un Cafe para Antioquia — Entrevistas y dialogos",
  description:
    "Conversaciones con quienes construyen el futuro del departamento.",
};

export default function UnCafePage() {
  return (
    <>
      <PageHero
        title="Un Cafe para Antioquia"
        subtitle="Conversaciones con quienes construyen el futuro del departamento."
      />

      {/* Coffee decoration */}
      <div className="flex justify-center -mt-8 mb-4 relative z-10">
        <div className="bg-dorado-tierra/10 rounded-full p-4">
          <Coffee className="w-8 h-8 text-dorado-tierra" />
        </div>
      </div>

      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {episodes.map((episode, index) => (
            <FadeIn key={episode.number} delay={index * 100}>
              <EpisodeCard
                number={episode.number}
                title={episode.title}
                guest={episode.guest}
                guestRole={episode.guestRole}
                description={episode.description}
                format={episode.format}
                image={episode.image}
              />
            </FadeIn>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
