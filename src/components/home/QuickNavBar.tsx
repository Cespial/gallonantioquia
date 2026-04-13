import Link from "next/link";
import {
  featuredReflection,
  stories,
  ideas,
} from "@/data/content";

const quickNav = [
  { label: "Columna Inaugural", excerpt: "Las memorias que no quiero guardar en silencio", href: "/columnas/las-memorias-que-no-quiero-guardar-en-silencio" },
  { label: "Última Reflexión", excerpt: featuredReflection.title, href: `/bitacora/${featuredReflection.slug}` },
  { label: "Historia Destacada", excerpt: stories[0].title, href: `/territorio-vivo/${stories[0].slug}` },
  { label: "Ideas para el Futuro", excerpt: ideas[0].title, href: `/antioquia-piensa/${ideas[0].slug}` },
];

export default function QuickNavBar() {
  return (
    <section className="bg-[#0B3B24] border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {quickNav.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className="group block px-4 md:px-5 py-5 md:py-6 hover:bg-white/5 transition-colors"
            >
              <p className="font-ui uppercase tracking-[0.15em] text-dorado-tierra text-[9px] md:text-[10px] mb-2">
                {item.label}
              </p>
              <p className="font-display text-white text-sm md:text-base leading-snug line-clamp-2 group-hover:text-dorado-tierra transition-colors">
                {item.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
