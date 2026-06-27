"use client";

/* ------------------------------------------------------------------ *
 *  ScrollHero — a full-screen, scroll-driven cinematic hero.
 *
 *  The panel is pinned while the user scrolls ~4.6 viewport-heights;
 *  scroll progress (0 → 1) drives a single GSAP timeline that sequences
 *  a hand-built canvas scene (scan line → perspective grid → a wireframe
 *  skyline constructing itself → drifting particles) together with a
 *  masked, letter-by-letter text reveal and a gold accent bleed.
 *
 *  - GSAP + ScrollTrigger (npm, bundled — no CDN, keeps CSP 'self').
 *  - Canvas for all geometry (no video / GIF). Transform/opacity only on
 *    DOM layers; canvas redraws only on scroll → smooth at 60fps.
 *  - Geometry simplifies on small screens; honours prefers-reduced-motion
 *    by rendering the final composed frame statically (no pin, no scrub).
 *  - Dark throughout (#0a0a0a); never a white background.
 * ------------------------------------------------------------------ */

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NAME = "RUBENS CAPITAL PARTNERS";
const LINE_1 = "Real estate capital,";
const LINE_2 = "engineered with intent.";

/* ---- small maths helpers ------------------------------------------ */
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** progress of `p` within the sub-range [a,b], clamped to 0..1 */
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
/** smoothstep easing */
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Deterministic PRNG so the skyline is stable across resizes. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Building = {
  nx: number; // centre x, 0..1 of width
  nw: number; // width, 0..1 of width
  nh: number; // height, 0..1 of horizon band
  depth: number; // iso depth factor 0..1
  floors: number;
  start: number; // scroll progress at which this tower begins to rise
};
type Particle = { nx: number; ny: number; r: number; spd: number; drift: number };

/** Renders one line as individually animatable, mask-revealed letters. */
function Letters({ text }: { text: string }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className="block">
        {text.split("").map((ch, i) => (
          <span
            key={i}
            className="hero-letter inline-block opacity-0 will-change-transform"
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function ScrollHero() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const textInnerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!canvas || !root || !pin) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let mobile = false;
    let buildings: Building[] = [];
    let particles: Particle[] = [];
    let curP = 0;

    function buildScene() {
      const rng = mulberry32(20040420);
      const n = mobile ? 4 : 7;
      buildings = [];
      for (let i = 0; i < n; i++) {
        const slot = (i + 0.5) / n;
        buildings.push({
          nx: slot + (rng() - 0.5) * 0.05,
          nw: 0.05 + rng() * 0.05,
          nh: 0.32 + rng() * 0.5,
          depth: 0.25 + rng() * 0.6,
          floors: 5 + Math.floor(rng() * 9),
          start: 0.2 + (i / n) * 0.16 + rng() * 0.015,
        });
      }
      const pc = mobile ? 26 : 64;
      particles = [];
      for (let i = 0; i < pc; i++) {
        particles.push({
          nx: rng(),
          ny: rng(),
          r: 0.5 + rng() * 1.5,
          spd: 0.3 + rng() * 0.8,
          drift: rng(),
        });
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = pin!.clientWidth;
      height = pin!.clientHeight;
      mobile = width < 768;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildScene();
      draw(curP);
    }

    function draw(p: number) {
      const c = ctx!;
      // Opaque dark base — fading elements toward 0 alpha fades them to black.
      c.fillStyle = "#0a0a0a";
      c.fillRect(0, 0, width, height);

      const out = 1 - smooth(seg(p, 0.86, 1)); // global fade-out near the end
      if (out <= 0.001) return;

      const cx = width / 2;
      const horizon = height * 0.62;
      // Layered parallax drift (act 4 onward) for depth.
      const drift = smooth(seg(p, 0.55, 1)) * (mobile ? 10 : 26);

      /* --- Perspective floor grid (fades in, then persists) --------- */
      const g = smooth(seg(p, 0.04, 0.2));
      if (g > 0) {
        const gx = -drift * 0.3;
        const rows = mobile ? 7 : 10;
        for (let i = 1; i <= rows; i++) {
          const t = i / rows;
          const yy = horizon + Math.pow(t, 1.8) * (height - horizon);
          c.strokeStyle = `rgba(120,150,185,${0.12 * g * (1 - t * 0.45) * out})`;
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(0, yy);
          c.lineTo(width, yy);
          c.stroke();
        }
        const cols = mobile ? 7 : 12;
        for (let j = -cols; j <= cols; j++) {
          const x0 = cx + (j / cols) * (width * 0.95) + gx;
          c.strokeStyle = `rgba(120,150,185,${0.09 * g * out})`;
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(x0, height);
          c.lineTo(cx + gx, horizon);
          c.stroke();
        }
      }

      /* --- Horizon line + the opening scan ------------------------- */
      const horizonAlpha = smooth(seg(p, 0.03, 0.12));
      if (horizonAlpha > 0) {
        c.strokeStyle = `rgba(196,163,104,${0.22 * horizonAlpha * out})`;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(0, horizon);
        c.lineTo(width, horizon);
        c.stroke();
      }
      const scan = smooth(seg(p, 0, 0.1));
      const scanFade = 1 - smooth(seg(p, 0.12, 0.22));
      if (scan > 0 && scanFade > 0) {
        const hw = scan * width * 0.52;
        c.save();
        c.strokeStyle = `rgba(214,187,131,${0.95 * scanFade * out})`;
        c.shadowColor = `rgba(196,163,104,${0.7 * scanFade * out})`;
        c.shadowBlur = 16;
        c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(cx - hw, horizon);
        c.lineTo(cx + hw, horizon);
        c.stroke();
        c.restore();
      }

      /* --- Wireframe skyline constructing itself ------------------- */
      const bx = drift * 0.6;
      for (const b of buildings) {
        const grow = smooth(seg(p, b.start, b.start + 0.14));
        if (grow <= 0) continue;
        const w = b.nw * width;
        const fullH = b.nh * horizon * 0.94;
        const h = fullH * grow;
        const cxb = b.nx * width + bx;
        const lx = cxb - w / 2;
        const rx = cxb + w / 2;
        const baseY = horizon;
        const topY = baseY - h;
        const dx = Math.min(w * 0.45, 28) * (0.4 + b.depth * 0.6);
        const dy = -dx * 0.5;
        const edge = 0.55 * out;

        c.lineWidth = 1;
        c.strokeStyle = `rgba(196,163,104,${edge})`;
        // front face
        c.beginPath();
        c.moveTo(lx, baseY);
        c.lineTo(lx, topY);
        c.lineTo(rx, topY);
        c.lineTo(rx, baseY);
        c.stroke();
        // top face
        c.beginPath();
        c.moveTo(lx, topY);
        c.lineTo(lx + dx, topY + dy);
        c.lineTo(rx + dx, topY + dy);
        c.lineTo(rx, topY);
        c.stroke();
        // right (depth) face
        c.beginPath();
        c.moveTo(rx, topY);
        c.lineTo(rx + dx, topY + dy);
        c.lineTo(rx + dx, baseY + dy);
        c.lineTo(rx, baseY);
        c.stroke();
        // floor lines (only those already constructed)
        const gap = fullH / b.floors;
        c.strokeStyle = `rgba(125,155,190,${0.22 * out})`;
        for (let f = 1; f < b.floors; f++) {
          const fy = baseY - f * gap;
          if (fy < topY) break;
          c.beginPath();
          c.moveTo(lx, fy);
          c.lineTo(rx, fy);
          c.stroke();
        }
      }

      /* --- Drifting particles -------------------------------------- */
      const pa = smooth(seg(p, 0.22, 0.42));
      if (pa > 0) {
        const px = drift;
        for (const pt of particles) {
          const dY = (pt.ny + p * pt.spd * 0.22) % 1;
          const x = pt.nx * width + (pt.drift - 0.5) * px * 2;
          const y = (1 - dY) * height;
          const tw = 0.45 + 0.55 * Math.abs(Math.sin((pt.drift + p) * 6.283));
          c.fillStyle = `rgba(222,212,192,${0.5 * pa * tw * out})`;
          c.beginPath();
          c.arc(x, y, pt.r, 0, 6.283185);
          c.fill();
        }
      }
    }

    function setProgress(p: number) {
      curP = p;
      draw(p);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${clamp01(p)})`;
        barRef.current.style.opacity = p > 0.9 ? `${1 - (p - 0.9) / 0.1}` : "1";
      }
    }

    resize();
    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    };
    window.addEventListener("resize", onResize);

    const letters = root.querySelectorAll<HTMLElement>(".hero-letter");

    /* ---- Reduced motion: show the composed final frame, no pin ---- */
    if (reduce) {
      setProgress(0.8);
      gsap.set(letters, { y: 0, autoAlpha: 1 });
      gsap.set([eyebrowRef.current, taglineRef.current, ctaRef.current], {
        y: 0,
        autoAlpha: 1,
      });
      gsap.set(glowRef.current, { autoAlpha: 1 });
      gsap.set(cueRef.current, { autoAlpha: 0 });
      if (barRef.current) barRef.current.style.opacity = "0";

      // Keep the header coordinated even without the pin: light while the
      // static hero fills the viewport, dark once it scrolls away.
      window.dispatchEvent(new Event("hero:enter"));
      let past = false;
      const onScrollReduced = () => {
        const isPast = window.scrollY > height - 80;
        if (isPast !== past) {
          past = isPast;
          window.dispatchEvent(new Event(past ? "hero:leave" : "hero:enter"));
        }
      };
      window.addEventListener("scroll", onScrollReduced, { passive: true });
      return () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScrollReduced);
        cancelAnimationFrame(resizeRaf);
        window.dispatchEvent(new Event("hero:leave"));
      };
    }

    /* ---- Scroll-driven timeline --------------------------------- */
    const ctxGsap = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.set([eyebrowRef.current, taglineRef.current, ctaRef.current], {
        y: 18,
        autoAlpha: 0,
      });
      gsap.set(glowRef.current, { autoAlpha: 0 });

      const proxy = { p: 0 };
      let headerPast = false;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=460%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Hand the header back to its normal (dark-on-cream) styling
            // as the hero fades out near the end.
            const past = self.progress > 0.9;
            if (past !== headerPast) {
              headerPast = past;
              window.dispatchEvent(new Event(past ? "hero:leave" : "hero:enter"));
            }
          },
        },
      });

      // Canvas scene spans the whole timeline.
      tl.to(proxy, { p: 1, ease: "none", duration: 1, onUpdate: () => setProgress(proxy.p) }, 0);

      // Scroll cue fades once the scene begins.
      tl.to(cueRef.current, { autoAlpha: 0, duration: 0.05 }, 0.08);

      // Text arrival (≈42–63%). The headline cascades in as a tight,
      // engineered sweep (stagger spread is a FIXED span, not per-letter,
      // so it stays snappy regardless of character count), then the
      // supporting copy and CTAs land while the full scene holds.
      tl.to(eyebrowRef.current, { y: 0, autoAlpha: 1, duration: 0.04 }, 0.4);
      tl.fromTo(
        letters,
        { yPercent: 120, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: "power3.out",
          duration: 0.09,
          stagger: { amount: 0.1 },
        },
        0.44,
      );
      tl.to(taglineRef.current, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.64);
      tl.to(ctaRef.current, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.68);

      // Colour accent bleeds in (60–80%) and holds through the composition.
      tl.to(glowRef.current, { autoAlpha: 1, duration: 0.18, ease: "power1.out" }, 0.58);

      // Transition out (88–100%) — compress + fade for the handoff.
      tl.to(textInnerRef.current, { yPercent: -6, scale: 0.97, duration: 0.12 }, 0.88);
      tl.to([textWrapRef.current, glowRef.current], { autoAlpha: 0, duration: 0.1 }, 0.88);
    }, root);

    // Header starts light over the dark hero.
    window.dispatchEvent(new Event("hero:enter"));
    // Recompute pin metrics once fonts/layout settle.
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeRaf);
      ctxGsap.revert();
      window.dispatchEvent(new Event("hero:leave"));
    };
  }, []);

  return (
    <section ref={rootRef} className="relative bg-[#0a0a0a] text-cream-50">
      <div ref={pinRef} className="relative h-[100svh] w-full overflow-hidden">
        {/* Canvas geometry */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        {/* Gold accent bleed (in) + faint cool counter-light */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(60% 55% at 88% 92%, rgba(196,163,104,0.45), transparent 60%), radial-gradient(50% 45% at 8% 10%, rgba(70,110,170,0.22), transparent 60%)",
          }}
        />

        {/* Legibility + depth vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 42%, transparent 45%, rgba(5,8,14,0.55) 100%), linear-gradient(to bottom, rgba(10,10,10,0.5), transparent 22%, transparent 72%, rgba(10,10,10,0.85))",
          }}
        />

        {/* HUD corner label */}
        <div className="pointer-events-none absolute left-6 top-24 hidden items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-gold-400/60 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400/80" />
          Amsterdam · Est. 2004
        </div>

        {/* Text */}
        <div ref={textWrapRef} className="absolute inset-0 z-10 grid place-items-center px-6">
          <div ref={textInnerRef} className="w-full max-w-5xl text-center will-change-transform">
            <span
              ref={eyebrowRef}
              className="block text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-gold-400/90 opacity-0 sm:text-xs"
            >
              {NAME}
            </span>
            <h1 className="mt-6 font-display text-[2.4rem] font-light leading-[1.04] tracking-tight text-cream-50 sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              <Letters text={LINE_1} />
              <span className="text-gold-300">
                <Letters text={LINE_2} />
              </span>
            </h1>
            <p
              ref={taglineRef}
              className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-cream-200/70 opacity-0 sm:text-lg"
            >
              An independent real estate asset &amp; investment management
              platform — €4.0bn under management across the Netherlands and the
              United States.
            </p>
            <div ref={ctaRef} className="mt-9 flex flex-col items-center justify-center gap-3 opacity-0 sm:flex-row">
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
        <div
          ref={cueRef}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-cream-200/50">
            Scroll
          </span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold-400/80 to-transparent" />
        </div>

        {/* Sequence progress bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px bg-cream-100/10">
          <div
            ref={barRef}
            className="h-full origin-left bg-gradient-to-r from-gold-500 to-gold-300"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
