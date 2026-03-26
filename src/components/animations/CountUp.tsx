"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function easeOutExpo(t: number): number {
  return 1 - Math.pow(2, -10 * t);
}

export default function CountUp({
  end,
  suffix = "",
  duration = 2000,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(t);
      const value = Math.round(eased * end);

      setCurrent(value);

      if (t < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [end, duration]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate();
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [animate]);

  return (
    <span ref={ref}>
      {current.toLocaleString("es-CO")}
      {suffix}
    </span>
  );
}
