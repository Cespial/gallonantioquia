import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  IconoFacebook,
  IconoInstagram,
  IconoTiktok,
  IconoX,
  IconoYoutube,
} from "./IconosSociales";
import type { NavItem } from "@/types";

export default function Pie({
  navItems,
  contacto,
  redes,
}: {
  navItems: NavItem[];
  contacto: { email: string; telefono: string; direccion: string };
  redes: { x: string; instagram: string; youtube: string; facebook: string; tiktok: string };
}) {
  // Tres columnas, como en el mockup, repartiendo de forma pareja.
  const porColumna = Math.ceil(navItems.length / 3);
  const columnas = [0, 1, 2].map((i) =>
    navItems.slice(i * porColumna, (i + 1) * porColumna)
  );

  const sociales = [
    { href: redes.instagram, icono: IconoInstagram, nombre: "Instagram" },
    { href: redes.tiktok, icono: IconoTiktok, nombre: "TikTok" },
    { href: redes.youtube, icono: IconoYoutube, nombre: "YouTube" },
    { href: redes.facebook, icono: IconoFacebook, nombre: "Facebook" },
    { href: redes.x, icono: IconoX, nombre: "X" },
  ].filter((r) => r.href);

  return (
    <footer className="bg-campana-profundo pt-9">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 pb-6 lg:grid-cols-[1fr_1.3fr_1fr] lg:px-10">
        <div>
          <Image
            src="/images/campana/logo-gallon-blanco.png"
            alt="Gallón Gobernador"
            width={640}
            height={411}
            sizes="200px"
            className="h-[4.5rem] w-auto"
          />

          {sociales.length > 0 && (
            <ul className="mt-5 flex gap-3">
              {sociales.map(({ href, icono: Icono, nombre }) => (
                <li key={nombre}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={nombre}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white"
                  >
                    <Icono className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-campana text-sm font-bold uppercase tracking-wide text-white">
            Menú rápido
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {columnas.map((columna, i) => (
              <ul key={i} className="space-y-2">
                {columna.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-campana text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-campana text-sm font-bold uppercase tracking-wide text-white">
            Contáctanos
          </h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-campana-dorado" aria-hidden="true" />
              <a
                href={`mailto:${contacto.email}`}
                className="font-campana text-sm text-white/75 hover:text-white"
              >
                {contacto.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-campana-dorado" aria-hidden="true" />
              <a
                href={`tel:${contacto.telefono.replace(/\s/g, "")}`}
                className="font-campana text-sm text-white/75 hover:text-white"
              >
                {contacto.telefono}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-campana-dorado" aria-hidden="true" />
              <span className="font-campana text-sm text-white/75">{contacto.direccion}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-4 font-campana text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          {/* El año se calcula en el servidor: este es un Server Component y
              su salida no se hidrata. Si algún día lleva "use client", hay que
              moverlo a un useEffect o volverá el fallo de hidratación que dejó
              el sitio entero sin botones. */}
          <p>{new Date().getFullYear()} Gallón Gobernador. Todos los derechos reservados.</p>
          <p className="flex gap-6">
            <Link href="/privacidad" className="hover:text-white">
              Políticas de privacidad
            </Link>
            <Link href="/terminos" className="hover:text-white">
              Términos y condiciones
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
