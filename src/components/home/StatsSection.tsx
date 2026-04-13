import Image from "next/image";
import StatCounter from "@/components/content/StatCounter";
import FadeIn from "@/components/animations/FadeIn";
import { impactStats } from "@/data/content";

export default function StatsSection() {
  return (
    <section id="datos" className="relative py-24 md:py-32 bg-[#0B3B24] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <Image src="/images/fondo-mapa-antioquia.jpg" alt="" fill sizes="100vw" className="object-cover" aria-hidden="true" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        <FadeIn>
          <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] mb-4">
            El camino en números
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tight text-white mb-16">
            Un camino de <span className="text-dorado-tierra italic">toda una vida</span>
          </h2>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-16 md:gap-y-20">
          {impactStats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 100}>
              <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
