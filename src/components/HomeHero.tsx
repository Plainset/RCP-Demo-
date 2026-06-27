"use client";

import Link from "next/link";
import { company } from "@/lib/site";

const HERO_IMG =
  "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=2000&q=80";

// Stepped skyline silhouette drawn along the lower band of the hero.
const SKYLINE =
  "M0 800 L110 800 L110 712 L235 712 L235 752 L355 752 L355 648 L470 648 L470 726 L600 726 L600 596 L705 596 L705 694 L840 694 L840 662 L980 662 L980 560 L1085 560 L1085 706 L1220 706 L1220 640 L1320 640 L1320 724 L1440 724";

// Vertical "tower" accents rising from the skyline.
const TOWERS = [
  { x: 355, y1: 648, y2: 360, delay: 1.1 },
  { x: 705, y1: 596, y2: 300, delay: 1.35 },
  { x: 980, y1: 560, y2: 250, delay: 1.6 },
];

const DASH = 3000;

export default function HomeHero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-950 text-cream-50">
      {/* Cinematic photograph (slow ken-burns) */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-kenburns"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
      </div>

      {/* Tonal gradients for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-ink-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 to-transparent" />

      {/* Architectural blueprint line motif */}
      <div className="pointer-events-none absolute inset-0 animate-drift opacity-[0.5] mix-blend-screen">
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMax slice"
          className="h-full w-full"
          fill="none"
          aria-hidden="true"
        >
          <g stroke="#d6bb83" strokeWidth={1.4} vectorEffect="non-scaling-stroke">
            <path
              d={SKYLINE}
              strokeDasharray={DASH}
              strokeDashoffset={DASH}
              className="animate-draw"
              style={{ animationDelay: "0.5s" }}
            />
            {TOWERS.map((t) => (
              <line
                key={t.x}
                x1={t.x}
                y1={t.y1}
                x2={t.x}
                y2={t.y2}
                strokeDasharray={DASH}
                strokeDashoffset={DASH}
                className="animate-draw"
                style={{ animationDelay: `${t.delay}s` }}
                opacity={0.8}
              />
            ))}
            {/* floor ticks on the tallest tower */}
            {[300, 350, 400, 450, 500].map((y, i) => (
              <line
                key={y}
                x1={958}
                y1={y}
                x2={1002}
                y2={y}
                strokeDasharray={120}
                strokeDashoffset={120}
                className="animate-draw"
                style={{ animationDelay: `${1.8 + i * 0.12}s` }}
                opacity={0.55}
              />
            ))}
            {/* horizon baseline */}
            <line
              x1={0}
              y1={800}
              x2={1440}
              y2={800}
              strokeDasharray={DASH}
              strokeDashoffset={DASH}
              className="animate-draw"
              opacity={0.4}
            />
          </g>
        </svg>
      </div>

      {/* Rotating geometric accent (precision motif) */}
      <div className="pointer-events-none absolute -right-32 top-10 hidden opacity-[0.18] md:block lg:right-[-10rem] lg:top-24">
        <svg width="540" height="540" viewBox="0 0 540 540" className="animate-spin-slow" aria-hidden="true">
          <circle cx="270" cy="270" r="260" fill="none" stroke="#c4a368" strokeWidth="1" strokeDasharray="2 10" />
          <circle cx="270" cy="270" r="200" fill="none" stroke="#c4a368" strokeWidth="1" strokeDasharray="1633 100" />
          <circle cx="270" cy="270" r="140" fill="none" stroke="#c4a368" strokeWidth="1" />
        </svg>
      </div>

      {/* Light sweep */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -inset-y-16 left-0 w-1/3 bg-gradient-to-r from-transparent via-cream-50/12 to-transparent animate-sweep" />
      </div>

      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-40" />

      {/* Content */}
      <div className="shell relative w-full pb-16 pt-36 md:pb-24">
        <div className="max-w-3xl">
          <span className="line-mask">
            <span className="eyebrow line-rise" style={{ animationDelay: "0.15s" }}>
              Independent · Amsterdam · Est. {company.established}
            </span>
          </span>

          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.06] sm:text-6xl md:text-7xl">
            <span className="line-mask pb-[0.08em]">
              <span className="line-rise" style={{ animationDelay: "0.35s" }}>
                Real estate capital,
              </span>
            </span>
            <span className="line-mask pb-[0.08em]">
              <span className="line-rise text-gold-400" style={{ animationDelay: "0.5s" }}>
                stewarded with intent.
              </span>
            </span>
          </h1>

          <p
            className="reveal mt-7 max-w-xl text-lg leading-relaxed text-cream-200/80"
            style={{ animationDelay: "0.85s" }}
          >
            An independent real estate asset &amp; investment management platform —{" "}
            {company.aumLong} under management across the Netherlands and the United
            States, on behalf of institutional investors and family offices.
          </p>

          <div
            className="reveal mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "1s" }}
          >
            <Link href="/portfolio" className="btn btn-gold">
              Explore our strategies
            </Link>
            <Link href="/login" className="btn btn-ghost-light">
              Investor login
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-gold-400 to-transparent" />
      </div>
    </section>
  );
}
