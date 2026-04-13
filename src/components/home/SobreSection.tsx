import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

export default function SobreSection() {
  return (
    <section className="border-t border-borde/50 mb-12 md:mb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="pt-3 md:pt-4">
          <FadeIn>
            <Link href="/sobre" className="group relative block aspect-[21/9] overflow-hidden">
              <Image
                src="/images/gallon-retrato-obra-hd.jpg"
                alt="Horacio Gallón"
                fill
                sizes="100vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B24]/90 via-[#0B3B24]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="font-display text-2xl text-white group-hover:text-dorado-tierra transition-colors">Mi historia</h3>
                <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/60 mt-2">El camino que me trajo hasta aquí</p>
              </div>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
