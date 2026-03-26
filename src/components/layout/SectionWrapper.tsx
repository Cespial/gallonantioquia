"use client";

import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  id?: string;
}

export default function SectionWrapper({
  children,
  className,
  dark = false,
  id,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        dark && "bg-oscuro-verde text-white noise-texture",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {children}
      </div>
    </section>
  );
}
