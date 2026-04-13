import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden -mt-[72px] md:-mt-[88px] bg-[#0B3B24]">
      {/* Mobile: image background + text overlay */}
      <div className="md:hidden relative min-h-[100dvh]">
        <Image
          src="/images/gallon-retrato-obra-hd.jpg"
          alt="Horacio Gallón"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B24] via-[#0B3B24]/50 to-[#0B3B24]/20" />
        <div className="relative z-10 min-h-[100dvh] flex flex-col justify-end px-6 pb-20">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] mb-4">
              Horacio Gallón
            </p>
            <h1 className="font-display text-4xl leading-[0.9] tracking-tight text-white mb-4">
              Las memorias que<br />no quiero
              <span className="italic text-dorado-tierra"> guardar en silencio</span>
            </h1>
            <div className="w-12 h-px bg-dorado-tierra mb-4" />
            <p className="font-body text-white/60 text-base leading-relaxed mb-6">
              Mi historia. El camino que me trajo hasta aquí.
            </p>
            <Link
              href="/columnas/las-memorias-que-no-quiero-guardar-en-silencio"
              className="group inline-flex items-center gap-3 bg-dorado-tierra text-oscuro rounded-full px-6 py-3 font-heading font-bold text-sm hover:brightness-110 transition"
            >
              Leer columna
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>
      </div>

      {/* Desktop: split layout */}
      <div className="hidden md:grid md:grid-cols-2 min-h-[100dvh]">
        {/* Left: text */}
        <div className="flex flex-col justify-center px-16 lg:px-24 py-32">
          <FadeIn>
            <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] md:text-xs mb-6">
              Horacio Gallón
            </p>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.88] tracking-tight text-white max-w-lg mb-6">
              Las memorias que no quiero
              <span className="block italic text-dorado-tierra mt-1">guardar en silencio</span>
            </h1>
            <div className="w-16 h-px bg-dorado-tierra mb-8" />
            <p className="font-body text-white/50 text-lg max-w-md leading-relaxed mb-10">
              Mi historia. El camino que me trajo hasta aquí.
            </p>
            <Link
              href="/columnas/las-memorias-que-no-quiero-guardar-en-silencio"
              className="group inline-flex items-center gap-3 bg-dorado-tierra text-oscuro rounded-full px-7 py-3.5 font-heading font-bold text-sm hover:brightness-110 transition-all hover:gap-4"
            >
              Leer columna
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </FadeIn>
        </div>

        {/* Right: image */}
        <div className="relative overflow-hidden">
          <Image
            src="/images/gallon-retrato-obra-hd.jpg"
            alt="Horacio Gallón mirando de frente"
            fill
            priority
            sizes="50vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0B3B24] to-transparent" />
        </div>
      </div>
    </section>
  );
}
