import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import { stories } from "@/data/content";

export default function StoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <FadeIn>
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-3">Territorio Vivo</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tight">Historias</h2>
            </div>
            <Link href="/territorio-vivo" className="hidden md:inline-flex font-ui text-[10px] uppercase tracking-[0.2em] text-texto-terciario hover:text-verde-antioquia transition-colors">
              Ver todas &#8594;
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-borde/50 overflow-hidden">
          {stories.slice(0, 3).map((story, index) => (
            <FadeIn key={story.slug} delay={index * 100}>
              <Link
                href={`/territorio-vivo/${story.slug}`}
                className="group block py-8 md:px-8 first:md:pl-0 last:md:pr-0 border-b md:border-b-0 md:border-r border-borde/50 last:border-0 overflow-hidden"
              >
                <p className="font-ui uppercase tracking-[0.2em] text-dorado-tierra text-[10px] mb-3">{story.category}</p>
                <h3 className="font-display text-lg leading-snug group-hover:text-verde-antioquia transition-colors">{story.title}</h3>
                <p className="font-body text-sm text-texto-terciario mt-3 line-clamp-2">{story.excerpt}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
