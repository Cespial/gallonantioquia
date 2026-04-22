import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

const sectionGrid = [
  {
    title: "Huellas en Antioquia",
    subtitle: "Columnas y reflexiones",
    href: "/columnas",
    image: "/images/gallon-cafe.jpg",
  },
  {
    title: "Sobre Mí",
    subtitle: "Mi historia",
    href: "/sobre",
    image: "/images/gallon-portada.jpg",
  },
];

export default function SectionGrid() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {sectionGrid.map((section, index) => (
            <FadeIn key={section.href} delay={index * 80}>
              <Link
                href={section.href}
                className="group relative block aspect-[4/3] overflow-hidden"
              >
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B24]/90 via-[#0B3B24]/30 to-transparent group-hover:from-[#0B3B24]/70 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <h3 className="font-display text-xl md:text-2xl text-white leading-tight group-hover:text-dorado-tierra transition-colors">
                    {section.title}
                  </h3>
                  <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/60 mt-2">
                    {section.subtitle}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
