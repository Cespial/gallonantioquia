import Image from "next/image";
import NewsletterForm from "@/components/content/NewsletterForm";
import FadeIn from "@/components/animations/FadeIn";

export default function NewsletterSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/fondo-cafetal.jpg" alt="" fill sizes="100vw" className="object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-[#0B3B24]/85" />
      </div>
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        <FadeIn>
          <p className="font-ui uppercase tracking-[0.3em] text-dorado-tierra text-[10px] mb-6">Newsletter</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95] tracking-tight text-white mb-4">
            Carta para Antioquia
          </h2>
          <p className="font-body text-white/60 text-sm leading-relaxed mb-8">
            Una vez al mes te escribo con reflexiones, historias y conversaciones sobre Antioquia.
          </p>
          <NewsletterForm variant="dark" />
        </FadeIn>
      </div>
    </section>
  );
}
