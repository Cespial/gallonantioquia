import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { featuredReflection } from "@/data/content";

export default function FeaturedReflection() {
  return (
    <section className="py-16 md:py-24 border-t border-borde/50">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
            <div className="lg:col-span-5 lg:pr-16 flex flex-col justify-center order-2 lg:order-1">
              <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-6">
                Mis reflexiones
              </p>
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[0.95] tracking-tight text-texto-principal mb-6">
                {featuredReflection.title}
              </h2>
              <p className="font-body text-texto-secundario text-base leading-relaxed mb-8">
                {featuredReflection.excerpt}
              </p>
              <Link
                href={`/bitacora/${featuredReflection.slug}`}
                className="group inline-flex items-center gap-3 font-ui text-xs uppercase tracking-[0.15em] text-texto-principal border-b border-texto-principal/20 pb-2 hover:border-verde-antioquia hover:text-verde-antioquia transition-all duration-300 w-fit"
              >
                Seguir leyendo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative w-full aspect-[4/3] lg:aspect-[3/4]">
                <Image
                  src={featuredReflection.image}
                  alt={featuredReflection.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
