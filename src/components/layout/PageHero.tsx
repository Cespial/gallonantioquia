"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  overlay?: boolean;
  compact?: boolean;
  label?: string;
}

export default function PageHero({
  title,
  subtitle,
  backgroundImage,
  backgroundPosition = "center",
  overlay = true,
  compact = false,
  label,
}: PageHeroProps) {
  const hasImage = !!backgroundImage;

  return (
    <section
      className={cn(
        "relative w-full flex items-center justify-center text-center overflow-hidden",
        compact ? "py-16 md:py-24" : "py-24 md:py-36"
      )}
    >
      {/* Background Image */}
      {hasImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={backgroundPosition !== "center" ? { objectPosition: backgroundPosition } : undefined}
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-oscuro-verde/60 to-oscuro-verde/85" />
          )}
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {label && (
          <span
            className={cn(
              "inline-block font-ui text-sm uppercase tracking-label mb-4",
              hasImage ? "text-dorado-tierra" : "text-dorado-tierra"
            )}
          >
            {label}
          </span>
        )}

        <h1
          className={cn(
            "font-display text-page-title text-balance",
            hasImage ? "text-white" : "text-texto-principal"
          )}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={cn(
              "mt-6 font-body text-lg md:text-xl leading-relaxed max-w-2xl mx-auto",
              hasImage ? "text-white/85" : "text-texto-secundario"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
