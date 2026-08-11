"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import type { NavItem } from "@/types";

export default function Encabezado({ navItems }: { navItems: NavItem[] }) {
  const [abierto, setAbierto] = useState(false);
  const ruta = usePathname();

  // Al navegar, el menú móvil se cierra solo: dejarlo abierto sobre la página
  // nueva es un clásico de los menús que se hacen a mano.
  useEffect(() => setAbierto(false), [ruta]);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-5 py-3 lg:px-10">
        <Link href="/" className="shrink-0" aria-label="Gallón Gobernador, ir al inicio">
          <Image
            src="/images/campana/logo-gallon.png"
            alt="Gallón Gobernador"
            width={640}
            height={411}
            priority
            className="h-11 w-auto lg:h-14"
          />
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => {
              const activo = ruta === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={activo ? "page" : undefined}
                    className={`font-campana text-[15px] transition-colors ${
                      activo
                        ? "font-semibold text-campana-bosque"
                        : "text-neutral-700 hover:text-campana-bosque"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href="/contacto"
          className="ml-auto hidden rounded-full bg-campana-dorado px-6 py-2.5 font-campana text-[13px] font-bold uppercase tracking-wide text-white shadow-sm transition-transform hover:scale-[1.03] lg:ml-0 lg:block"
        >
          Únete al equipo
        </Link>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          className="ml-auto rounded p-2 text-campana-bosque lg:hidden"
        >
          {abierto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {abierto && (
        <nav
          aria-label="Principal móvil"
          className="border-t border-black/5 bg-white px-5 pb-6 pt-2 lg:hidden"
        >
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border-b border-black/5 py-3 font-campana text-base text-neutral-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            className="mt-5 block rounded-full bg-campana-dorado px-6 py-3 text-center font-campana text-sm font-bold uppercase tracking-wide text-white"
          >
            Únete al equipo
          </Link>
        </nav>
      )}
    </header>
  );
}
