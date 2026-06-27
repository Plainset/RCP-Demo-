"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to?: number; // when omitted, `value` is rendered statically
  value?: string; // static fallback / non-numeric (e.g. "AFM")
  prefix?: string;
  suffix?: string;
  decimals?: number;
  commas?: boolean;
  durationMs?: number;
  className?: string;
};

function format(n: number, decimals: number, commas: boolean): string {
  if (commas) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return n.toFixed(decimals);
}

/**
 * Counts up to `to` once scrolled into view (eased). Falls back to the static
 * `value` when there is no numeric target or reduced motion is requested.
 */
export default function CountUp({
  to,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  commas = false,
  durationMs = 1600,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(
    to === undefined ? value ?? "" : `${prefix}${format(0, decimals, commas)}${suffix}`
  );

  useEffect(() => {
    if (to === undefined) {
      setDisplay(value ?? "");
      return;
    }
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finalStr = `${prefix}${format(to, decimals, commas)}${suffix}`;
    if (reduce) {
      setDisplay(finalStr);
      return;
    }

    let raf = 0;
    let started = false;
    const run = (startTime: number) => {
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / durationMs);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(`${prefix}${format(to * eased, decimals, commas)}${suffix}`);
        if (t < 1) raf = requestAnimationFrame(tick);
        else setDisplay(finalStr);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          run(performance.now());
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, value, prefix, suffix, decimals, commas, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
