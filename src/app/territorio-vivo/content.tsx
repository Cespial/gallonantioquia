"use client";

import { useState } from "react";
import PageHero from "@/components/layout/PageHero";
import SectionWrapper from "@/components/layout/SectionWrapper";
import ArticleCard from "@/components/content/ArticleCard";
import CategoryTag from "@/components/content/CategoryTag";
import FadeIn from "@/components/animations/FadeIn";
import { stories, storyCategories } from "@/data/content";

export default function TerritorioVivoContent() {
  const [activeCategory, setActiveCategory] = useState("Todas");

  const filteredStories =
    activeCategory === "Todas"
      ? stories
      : stories.filter((s) => s.category === activeCategory);

  return (
    <>
      <PageHero
        title="Territorio Vivo"
        subtitle="Historias humanas de una Antioquia que se transforma"
        backgroundImage="/images/gallon-vias-seguridad.jpg"
      />

      <SectionWrapper>
        {/* Category filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {storyCategories.map((cat) => (
            <CategoryTag
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        {/* Stories grid */}
        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story, i) => (
              <FadeIn
                key={story.slug}
                delay={i * 80}
                className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}
              >
                <ArticleCard
                  slug={story.slug}
                  title={story.title}
                  excerpt={story.excerpt}
                  category={story.category}
                  date={story.date}
                  readTime={story.readTime}
                  format={story.format}
                  image={story.image}
                  featured={i === 0}
                />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-body text-texto-secundario text-lg">
              No hay historias en esta categor&iacute;a a&uacute;n.
            </p>
          </div>
        )}
      </SectionWrapper>
    </>
  );
}
