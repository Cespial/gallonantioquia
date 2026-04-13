import Link from "next/link";
import { navItems } from "@/data/content";

const contentLinks = [
  { label: "Ultima reflexion", href: "/bitacora" },
  { label: "Columna inaugural", href: "/columnas/las-memorias-que-no-quiero-guardar-en-silencio" },
];

const legalLinks = [
  { label: "Privacidad", href: "/privacidad" },
  { label: "Terminos", href: "/terminos" },
];

const socialLinks = [
  { label: "Twitter / X", href: "https://twitter.com/GallonHoracio" },
  { label: "Instagram", href: "https://instagram.com/gallonantioquia" },
  { label: "YouTube", href: "https://youtube.com/@gallonantioquia" },
];

export default function Footer() {
  return (
    <footer className="relative">
      {/* Mountain Silhouette SVG */}
      <div className="relative -mb-px">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 L0,80 Q180,20 360,60 Q540,100 720,40 Q900,0 1080,50 Q1260,90 1440,30 L1440,120 Z"
            fill="var(--oscuro-verde)"
          />
        </svg>
      </div>

      {/* Footer Content */}
      <div className="bg-oscuro-verde text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Top: Logo + Tagline + Newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12 border-b border-white/10">
            <div>
              <div className="flex flex-col items-start mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-brand text-xl text-white">
                    GALL<span className="relative inline-block">O<span className="absolute -top-[0.22em] left-1/2 -translate-x-1/2 text-dorado-tierra text-[0.7em] leading-none" style={{fontFamily: "serif"}}>&#769;</span></span>N
                  </span>
                  <span className="font-brand text-xl text-dorado-tierra">
                    MEMORIAS
                  </span>
                </div>
                <span className="font-accent text-[7px] uppercase tracking-[0.4em] text-white/40 mt-0.5 self-center">
                  Historias & Reflexiones
                </span>
              </div>
              <p className="font-body text-white/70 max-w-md leading-relaxed">
                Memorias, reflexiones y conversaciones sobre Antioquia.
              </p>
            </div>

            {/* Newsletter */}
            <div className="lg:flex lg:flex-col lg:items-end lg:justify-center">
              <p className="font-heading font-bold text-sm uppercase tracking-label text-dorado-tierra mb-3">
                Newsletter
              </p>
              <form action="#" className="flex gap-2 w-full max-w-md">
                <input
                  type="email"
                  placeholder="Tu correo electronico"
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-sm text-white placeholder:text-white/40 font-ui focus:outline-none focus:border-dorado-tierra transition"
                />
                <button
                  type="submit"
                  className="bg-dorado-tierra text-oscuro rounded-full px-6 py-2.5 font-heading font-bold text-sm hover:brightness-110 transition whitespace-nowrap"
                >
                  Suscribirme
                </button>
              </form>
            </div>
          </div>

          {/* Middle: Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
            {/* Secciones */}
            <div>
              <h4 className="font-heading font-bold text-sm uppercase tracking-label text-dorado-tierra mb-4">
                Secciones
              </h4>
              <ul className="space-y-2.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-ui text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contenido */}
            <div>
              <h4 className="font-heading font-bold text-sm uppercase tracking-label text-dorado-tierra mb-4">
                Contenido
              </h4>
              <ul className="space-y-2.5">
                {contentLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-ui text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-heading font-bold text-sm uppercase tracking-label text-dorado-tierra mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {legalLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-ui text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-heading font-bold text-sm uppercase tracking-label text-dorado-tierra mb-4">
                Redes
              </h4>
              <ul className="space-y-2.5">
                {socialLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ui text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom: Copyright */}
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="font-ui text-xs text-white/50">
              &copy; 2024&ndash;2026 Gallón Memorias. Hecho con amor por Antioquia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
