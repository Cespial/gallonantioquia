"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import CountUp from "@/components/animations/CountUp";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface Chapter {
  id: string;
  label: string;
  year: string;
  title: string;
  text: string;
  image: string;
  stat?: { value: number; suffix: string; label: string };
  quote?: string;
}

interface ScrollytellingProps {
  chapters: Chapter[];
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function Scrollytelling({ chapters }: ScrollytellingProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    stepRefs.current.forEach((step, index) => {
      if (!step) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
      );

      observer.observe(step);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const active = chapters[activeIndex];

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-col lg:flex-row">
        {/* ================================================================ */}
        {/* LEFT: Sticky visual panel                                        */}
        {/* ================================================================ */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Image layers — all stacked, only active is visible */}
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-in-out",
                  index === activeIndex ? "opacity-100" : "opacity-0"
                )}
              >
                <img
                  src={chapter.image}
                  alt={chapter.title}
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B3B24]/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B24]/60 via-transparent to-transparent" />
              </div>
            ))}

            {/* Year overlay — bottom-left */}
            <div className="absolute bottom-12 left-12 z-10">
              <span
                key={active.year}
                className="font-display text-[8rem] leading-none font-black text-white/10 select-none"
              >
                {active.year}
              </span>
            </div>

            {/* Stat overlay — if active chapter has one */}
            {active.stat && (
              <div className="absolute top-1/2 left-12 -translate-y-1/2 z-10">
                <div className="text-center">
                  <div className="font-display text-6xl font-black text-dorado-tierra">
                    <CountUp end={active.stat.value} suffix={active.stat.suffix} />
                  </div>
                  <p className="font-ui text-xs uppercase tracking-[0.2em] text-white/60 mt-2">
                    {active.stat.label}
                  </p>
                </div>
              </div>
            )}

            {/* Chapter progress indicator */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
              {chapters.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-1 rounded-full transition-all duration-500",
                    index === activeIndex
                      ? "h-8 bg-dorado-tierra"
                      : "h-2 bg-white/20"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT: Scrollable text chapters                                   */}
        {/* ================================================================ */}
        <div className="w-full lg:w-1/2">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              ref={setStepRef(index)}
              className={cn(
                "min-h-[80vh] lg:min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-20 py-16 transition-opacity duration-500",
                index === activeIndex ? "opacity-100" : "lg:opacity-40"
              )}
            >
              {/* Mobile image — only visible on small screens */}
              <div className="lg:hidden mb-8 relative overflow-hidden aspect-video">
                <img
                  src={chapter.image}
                  alt={chapter.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B24]/60 to-transparent" />
                <span className="absolute bottom-4 left-4 font-display text-4xl font-black text-white/20">
                  {chapter.year}
                </span>
              </div>

              {/* Label */}
              <p className="font-ui uppercase tracking-[0.25em] text-dorado-tierra text-[10px] mb-2">
                {chapter.label}
              </p>

              {/* Year (mobile) */}
              <p className="lg:hidden font-display text-3xl font-black text-borde/40 mb-2">
                {chapter.year}
              </p>

              {/* Title */}
              <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-[0.95] tracking-tight text-texto-principal mb-6">
                {chapter.title}
              </h2>

              {/* Body text */}
              <p className="font-body text-texto-secundario text-base md:text-lg leading-relaxed max-w-xl">
                {chapter.text}
              </p>

              {/* Mobile stat */}
              {chapter.stat && (
                <div className="lg:hidden mt-8 p-6 bg-[#0B3B24] rounded-lg">
                  <div className="font-display text-4xl font-black text-dorado-tierra">
                    <CountUp end={chapter.stat.value} suffix={chapter.stat.suffix} />
                  </div>
                  <p className="font-ui text-xs uppercase tracking-[0.2em] text-white/60 mt-1">
                    {chapter.stat.label}
                  </p>
                </div>
              )}

              {/* Quote */}
              {chapter.quote && (
                <blockquote className="mt-8 border-l-2 border-dorado-tierra pl-6">
                  <p className="font-display italic text-xl text-texto-principal leading-snug">
                    &ldquo;{chapter.quote}&rdquo;
                  </p>
                </blockquote>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
