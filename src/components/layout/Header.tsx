"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/data/content";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shrink, setShrink] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setShrink(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        shrink
          ? "bg-blanco-calido/95 backdrop-blur-md border-b border-borde shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="font-display font-black text-xl text-verde-antioquia">
            GALLON
          </span>
          <span className="font-display font-black text-xl text-dorado-tierra">
            ANTIOQUIA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "link-underline font-ui text-sm uppercase tracking-label transition-colors",
                  isActive
                    ? "text-verde-antioquia font-bold"
                    : "text-texto-secundario hover:text-texto-principal"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA + Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/participa"
            className="hidden lg:inline-flex bg-dorado-tierra text-oscuro rounded-full px-5 py-2 font-heading font-bold text-sm hover:brightness-110 transition"
          >
            Suscribirse
          </Link>

          <button
            type="button"
            className="lg:hidden p-2 text-texto-principal"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-oscuro/40 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Side Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-blanco-calido shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-borde">
          <Link
            href="/"
            className="flex items-baseline gap-1"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-display font-black text-lg text-verde-antioquia">
              GALLON
            </span>
            <span className="font-display font-black text-lg text-dorado-tierra">
              ANTIOQUIA
            </span>
          </Link>
          <button
            type="button"
            className="p-2 text-texto-principal"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col px-5 py-6 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-ui text-sm uppercase tracking-label py-3 border-b border-borde/50 transition-colors",
                  isActive
                    ? "text-verde-antioquia font-bold"
                    : "text-texto-secundario hover:text-texto-principal"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 pt-4">
          <Link
            href="/participa"
            onClick={() => setMobileOpen(false)}
            className="block text-center bg-dorado-tierra text-oscuro rounded-full px-5 py-3 font-heading font-bold text-sm hover:brightness-110 transition"
          >
            Suscribirse
          </Link>
        </div>
      </div>
    </header>
  );
}
