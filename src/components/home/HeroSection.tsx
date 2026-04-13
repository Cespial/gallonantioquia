import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] md:min-h-[110dvh] overflow-hidden -mt-[72px] md:-mt-[88px]">
      <div className="absolute inset-0">
        <Image
          src="/images/gallon-retrato-obra-hd.jpg"
          alt="Horacio Gallón mirando de frente"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "60% 15%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B24]/90 via-[#0B3B24]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B24]/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 min-h-[100dvh] md:min-h-[110dvh] flex flex-col justify-end px-6 md:px-16 lg:px-24 pb-20 md:pb-28">
        <FadeIn>
          <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] md:text-xs mb-4">
            Horacio Gallón
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-tight text-white max-w-3xl mb-6">
            Las memorias que no quiero<br />
            <span className="italic text-dorado-tierra">guardar en silencio</span>
          </h1>
          <p className="font-body text-white/60 text-lg md:text-xl max-w-xl leading-relaxed mb-8">
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
    </section>
  );
}
