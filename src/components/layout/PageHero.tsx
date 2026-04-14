"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFacePosition } from "@/lib/image-positions";

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
  backgroundPosition,
  overlay = true,
  compact = false,
  label,
}: PageHeroProps) {
  const hasImage = !!backgroundImage;
  const position = backgroundPosition || (hasImage ? getFacePosition(backgroundImage!) : "center");

  return (
    <section
      className={cn(
        "relative w-full flex items-end text-center overflow-hidden",
        compact
          ? "py-16 md:py-24"
          : "min-h-[50vh] md:min-h-[60vh]"
      )}
    >
      {hasImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: position }}
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-oscuro-verde/90 via-oscuro-verde/40 to-oscuro-verde/20" />
          )}
        </>
      )}

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 pt-32 md:pt-40">
        {label && (
          <span className="inline-block font-ui text-sm uppercase tracking-label mb-4 text-dorado-tierra">
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
