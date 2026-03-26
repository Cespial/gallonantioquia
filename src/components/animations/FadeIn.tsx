"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type FadeDirection = "up" | "left" | "right" | "none";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: FadeDirection;
}

const initialTransforms: Record<FadeDirection, string> = {
  up: "translateY(30px)",
  left: "translateX(-30px)",
  right: "translateX(30px)",
  none: "none",
};

export default function FadeIn({
  children,
  delay = 0,
  className,
  direction = "up",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0, 0)" : initialTransforms[direction],
        transition: `opacity 0.6s ease-out, transform 0.6s ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
