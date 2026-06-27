"use client";

/* ------------------------------------------------------------------ *
 *  ScrollHero — a full-screen, scroll-driven cinematic hero.
 *
 *  Concept: "The Reclaimed Survey." Bespoke to Rubens Capital Partners —
 *  a Dutch real-estate firm. As you scroll, a top-down cadastral survey
 *  draws itself at golden hour: water hatch drains away → a mesh of
 *  surveyed land parcels and a meandering canal ink themselves in →
 *  a handful of parcels light up as small warm homes (plus a couple of
 *  larger multifamily blocks). It reads as a draughtsman's land survey,
 *  not a sci-fi skyline — "engineered/stewarded" made literal.
 *
 *  The panel is pinned (~300vh) and scroll progress (0→1) drives one GSAP
 *  timeline: the canvas scene + a masked, letter-by-letter headline
 *  reveal + a single gold accent, ending in a "dawn dissolve" to the cream
 *  page below. Canvas only (no video/GIF); transform/opacity on DOM;
 *  redraws on scroll → 60fps. Geometry simplifies on mobile; honours
 *  prefers-reduced-motion with a static composed frame. GSAP is bundled
 *  (no CDN) so the CSP stays script-src 'self'.
 * ------------------------------------------------------------------ */

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const NAME = "RUBENS CAPITAL PARTNERS";
const LINE_1 = "Built to last.";
const LINE_2 = "Managed to perform.";

/* ---- maths helpers ------------------------------------------------ */
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
/** progress of `p` within [a,b], clamped 0..1 */
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
/** smoothstep */
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Deterministic PRNG so the survey is stable across resizes. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Node = { u: number; v: number };
type Cell = { i: number; j: number; start: number };

/**
 * Renders one line as individually animatable, mask-revealed letters.
 * Letters are grouped into non-breaking words so a line only ever wraps
 * between words (never mid-word) — important on small screens.
 */
function Letters({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className="block">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {wi > 0 ? " " : null}
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((ch, ci) => (
                <span
                  key={ci}
                  className="hero-letter inline-block opacity-0 will-change-transform"
                >
                  {ch}
                </span>
              ))}
            </span>
          </Fragment>
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
  const vignetteRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
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
    let cols = 8;
    let rows = 6;
    let nodes: Node[][] = [];
    let homes: Cell[] = [];
    let blocks: Cell[] = [];
    let canalPts: Node[] = [];
    let particles: { nx: number; ny: number; r: number; spd: number; drift: number }[] = [];
    let curP = 0;

    function buildScene() {
      const rng = mulberry32(20040420);
      cols = mobile ? 5 : 8;
      rows = mobile ? 4 : 6;

      // Jittered survey nodes; borders stay flush so the plat reads clean.
      nodes = [];
      for (let i = 0; i <= cols; i++) {
        nodes[i] = [];
        for (let j = 0; j <= rows; j++) {
          let u = i / cols;
          let v = j / rows;
          if (i > 0 && i < cols) u += (rng() - 0.5) * 0.045;
          if (j > 0 && j < rows) v += (rng() - 0.5) * 0.04;
          nodes[i][j] = { u, v };
        }
      }

      // A meandering canal across the plat.
      canalPts = [];
      const sn = 26;
      for (let k = 0; k <= sn; k++) {
        const t = k / sn;
        canalPts.push({
          u: 0.66 + 0.15 * Math.sin(t * Math.PI * 1.6 + 0.4) - t * 0.2,
          v: 0.1 + t * 0.92,
        });
      }

      // Pick homes + a couple of larger multifamily blocks, deterministically.
      const cells: { i: number; j: number; r: number }[] = [];
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) cells.push({ i, j, r: rng() });
      cells.sort((a, b) => a.r - b.r);
      const homeCount = mobile ? 4 : 7;
      const blockCount = mobile ? 1 : 2;
      homes = cells.slice(0, homeCount).map((c, idx) => ({ i: c.i, j: c.j, start: 0.6 + idx * 0.022 }));
      blocks = cells
        .slice(homeCount, homeCount + blockCount)
        .map((c, idx) => ({ i: c.i, j: c.j, start: 0.63 + idx * 0.04 }));

      const pc = mobile ? 16 : 34;
      particles = [];
      for (let i = 0; i < pc; i++) {
        particles.push({
          nx: rng(),
          ny: rng(),
          r: 0.5 + rng() * 1.3,
          spd: 0.3 + rng() * 0.7,
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
      c.fillStyle = "#0a0b0d";
      c.fillRect(0, 0, width, height);

      const out = 1 - smooth(seg(p, 0.86, 1));
      const dawn = smooth(seg(p, 0.88, 1));

      const cx = width / 2;
      const mapTop = height * 0.34;
      const mapH = height * 0.62;
      const mapW = width * 0.94;
      const conv = 0.12;
      const drift = smooth(seg(p, 0.5, 1));
      const driftX = drift * (mobile ? 8 : 18);
      const driftY = -drift * (mobile ? 5 : 11);

      // top-down plat with a gentle tilt (far edge = v0 = top, slightly narrower)
      const P = (u: number, v: number) => ({
        x: cx + (u - 0.5) * mapW * (1 - (1 - v) * conv) + driftX,
        y: mapTop + Math.pow(v, 1.05) * mapH + driftY,
      });
      const node = (i: number, j: number) => {
        const n = nodes[i][j];
        return P(n.u, n.v);
      };

      const polyProg = (pts: { x: number; y: number }[], frac: number, style: string, lw: number) => {
        if (frac <= 0 || pts.length < 2) return;
        let total = 0;
        for (let k = 1; k < pts.length; k++)
          total += Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y);
        const target = total * frac;
        c.strokeStyle = style;
        c.lineWidth = lw;
        c.lineJoin = "round";
        c.beginPath();
        c.moveTo(pts[0].x, pts[0].y);
        let acc = 0;
        for (let k = 1; k < pts.length; k++) {
          const dx = pts[k].x - pts[k - 1].x;
          const dy = pts[k].y - pts[k - 1].y;
          const s = Math.hypot(dx, dy);
          if (acc + s <= target) {
            c.lineTo(pts[k].x, pts[k].y);
            acc += s;
          } else {
            const t = (target - acc) / s;
            c.lineTo(pts[k - 1].x + dx * t, pts[k - 1].y + dy * t);
            break;
          }
        }
        c.stroke();
      };

      if (out > 0.001) {
        /* --- Water hatch draining away (Act 1–2) ------------------- */
        const land = smooth(seg(p, 0.14, 0.44));
        const hatch = (1 - land) * smooth(seg(p, 0.02, 0.12)) * out;
        if (hatch > 0.001) {
          c.strokeStyle = `rgba(90,122,149,${0.07 * hatch})`;
          c.lineWidth = 1;
          const x0 = cx - mapW / 2 - 40;
          const x1 = cx + mapW / 2 + 40;
          for (let y = mapTop - 30; y < mapTop + mapH + 30; y += 20) {
            c.beginPath();
            c.moveTo(x0, y);
            c.lineTo(x1, y - 60);
            c.stroke();
          }
        }

        /* --- Parcel tonal fill (Act 3, "land settles") ------------- */
        const fill = smooth(seg(p, 0.48, 0.72)) * out;
        if (fill > 0.001) {
          for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
              const a = node(i, j);
              const b = node(i + 1, j);
              const d = node(i + 1, j + 1);
              const e = node(i, j + 1);
              c.fillStyle = `rgba(228,216,190,${0.04 * fill})`;
              c.beginPath();
              c.moveTo(a.x, a.y);
              c.lineTo(b.x, b.y);
              c.lineTo(d.x, d.y);
              c.lineTo(e.x, e.y);
              c.closePath();
              c.fill();
            }
          }
        }

        /* --- Cadastral mesh draws itself (Act 2) ------------------- */
        const meshStyle = `rgba(196,163,104,${0.46 * out})`;
        for (let j = 0; j <= rows; j++) {
          const pts = [];
          for (let i = 0; i <= cols; i++) pts.push(node(i, j));
          const start = 0.16 + (j / rows) * 0.1;
          polyProg(pts, smooth(seg(p, start, start + 0.13)), meshStyle, 1);
        }
        for (let i = 0; i <= cols; i++) {
          const pts = [];
          for (let j = 0; j <= rows; j++) pts.push(node(i, j));
          const start = 0.18 + (i / cols) * 0.12;
          polyProg(pts, smooth(seg(p, start, start + 0.13)), meshStyle, 1);
        }

        /* --- The opening datum / waterline scan (Act 1) ----------- */
        const scan = smooth(seg(p, 0, 0.1));
        const scanFade = 1 - smooth(seg(p, 0.12, 0.24));
        if (scan > 0 && scanFade > 0) {
          const a = P(0, 0);
          const b = P(1, 0);
          c.save();
          c.strokeStyle = `rgba(214,187,131,${0.95 * scanFade * out})`;
          c.shadowColor = `rgba(196,163,104,${0.7 * scanFade * out})`;
          c.shadowBlur = 16;
          c.lineWidth = 1.6;
          polyProg([a, b], scan, `rgba(214,187,131,${0.95 * scanFade * out})`, 1.6);
          c.restore();
        }

        /* --- The canal (Act 2–3) ---------------------------------- */
        const canalScreen = canalPts.map((q) => P(q.u, q.v));
        const canalGrow = smooth(seg(p, 0.24, 0.46));
        polyProg(canalScreen, canalGrow, `rgba(96,128,156,${0.6 * out})`, 2.4);
        // faint gold survey trace beside the canal
        polyProg(canalScreen, canalGrow, `rgba(196,163,104,${0.22 * out})`, 1);

        /* --- Survey marks: north arrow + a dimension line --------- */
        const marks = smooth(seg(p, 0.22, 0.4)) * out;
        if (marks > 0.001) {
          // north arrow, upper-right of the plat
          const nx = cx + mapW * 0.42 + driftX;
          const ny = mapTop - 6;
          c.strokeStyle = `rgba(196,163,104,${0.5 * marks})`;
          c.fillStyle = `rgba(196,163,104,${0.5 * marks})`;
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(nx, ny + 26);
          c.lineTo(nx, ny);
          c.stroke();
          c.beginPath();
          c.moveTo(nx - 4, ny + 7);
          c.lineTo(nx, ny);
          c.lineTo(nx + 4, ny + 7);
          c.closePath();
          c.fill();
          c.font = "600 10px Inter, system-ui, sans-serif";
          c.fillText("N", nx - 3, ny - 5);
          // dimension line along the near edge between two nodes
          const da = node(1, rows);
          const db = node(2, rows);
          const off = 12;
          c.strokeStyle = `rgba(213,203,176,${0.4 * marks})`;
          c.beginPath();
          c.moveTo(da.x, da.y + off);
          c.lineTo(db.x, db.y + off);
          c.moveTo(da.x, da.y + off - 4);
          c.lineTo(da.x, da.y + off + 4);
          c.moveTo(db.x, db.y + off - 4);
          c.lineTo(db.x, db.y + off + 4);
          c.stroke();
        }

        /* --- Homes & multifamily blocks light up (Act 4 accent) --- */
        const center = (i: number, j: number) => {
          const a = node(i, j);
          const b = node(i + 1, j);
          const d = node(i + 1, j + 1);
          const e = node(i, j + 1);
          return {
            x: (a.x + b.x + d.x + e.x) / 4,
            y: (a.y + b.y + d.y + e.y) / 4,
            w: (Math.hypot(b.x - a.x, b.y - a.y) + Math.hypot(d.x - e.x, d.y - e.y)) / 2,
          };
        };
        for (const h of homes) {
          const a = smooth(seg(p, h.start, h.start + 0.12)) * out;
          if (a <= 0.001) continue;
          const m = center(h.i, h.j);
          const s = clamp(m.w * 0.42, 8, mobile ? 15 : 22);
          const w = s;
          const hh = s * 0.66;
          c.save();
          c.strokeStyle = `rgba(232,212,168,${a})`;
          c.fillStyle = `rgba(232,212,168,${a * 0.16})`;
          c.lineWidth = 1.2;
          c.shadowColor = `rgba(214,178,120,${a * 0.85})`;
          c.shadowBlur = 10;
          c.beginPath();
          c.rect(m.x - w / 2, m.y - hh / 2, w, hh);
          c.fill();
          c.stroke();
          c.beginPath();
          c.moveTo(m.x - w / 2 - 1.5, m.y - hh / 2);
          c.lineTo(m.x, m.y - hh / 2 - s * 0.52);
          c.lineTo(m.x + w / 2 + 1.5, m.y - hh / 2);
          c.stroke();
          c.restore();
        }
        for (const bl of blocks) {
          const a = smooth(seg(p, bl.start, bl.start + 0.12)) * out;
          if (a <= 0.001) continue;
          const m = center(bl.i, bl.j);
          const w = clamp(m.w * 0.66, 14, mobile ? 22 : 34);
          const hh = w * 0.74;
          c.save();
          c.strokeStyle = `rgba(196,163,104,${a})`;
          c.fillStyle = `rgba(196,163,104,${a * 0.12})`;
          c.lineWidth = 1.2;
          c.shadowColor = `rgba(196,163,104,${a * 0.7})`;
          c.shadowBlur = 9;
          c.beginPath();
          c.rect(m.x - w / 2, m.y - hh / 2, w, hh);
          c.fill();
          c.stroke();
          for (let f = 1; f < 3; f++) {
            const fy = m.y - hh / 2 + (hh / 3) * f;
            c.beginPath();
            c.moveTo(m.x - w / 2, fy);
            c.lineTo(m.x + w / 2, fy);
            c.stroke();
          }
          c.restore();
        }

        /* --- Drifting survey dust --------------------------------- */
        const pa = smooth(seg(p, 0.24, 0.44)) * out;
        if (pa > 0.001) {
          for (const pt of particles) {
            const dY = (pt.ny + p * pt.spd * 0.2) % 1;
            const x = pt.nx * width + (pt.drift - 0.5) * drift * 24;
            const y = (1 - dY) * height;
            const tw = 0.45 + 0.55 * Math.abs(Math.sin((pt.drift + p) * 6.283));
            c.fillStyle = `rgba(228,216,192,${0.4 * pa * tw})`;
            c.beginPath();
            c.arc(x, y, pt.r, 0, 6.2832);
            c.fill();
          }
        }
      }

      /* --- Dawn dissolve to cream (Act 5 handoff) ----------------- */
      if (dawn > 0.001) {
        const grad = c.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, `rgba(251,249,244,${dawn})`);
        grad.addColorStop(1, `rgba(251,249,244,${dawn * 0.7})`);
        c.fillStyle = grad;
        c.fillRect(0, 0, width, height);
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

    /* ---- Reduced motion: composed final frame, no pin ------------ */
    if (reduce) {
      setProgress(0.82);
      gsap.set(letters, { y: 0, autoAlpha: 1 });
      gsap.set([eyebrowRef.current, taglineRef.current, ctaRef.current], { y: 0, autoAlpha: 1 });
      gsap.set(glowRef.current, { autoAlpha: 1 });
      gsap.set(cueRef.current, { autoAlpha: 0 });
      if (barRef.current) barRef.current.style.opacity = "0";

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

      gsap.set([eyebrowRef.current, taglineRef.current, ctaRef.current], { y: 18, autoAlpha: 0 });
      gsap.set(glowRef.current, { autoAlpha: 0 });

      let headerPast = false;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const past = self.progress > 0.9;
            if (past !== headerPast) {
              headerPast = past;
              window.dispatchEvent(new Event(past ? "hero:leave" : "hero:enter"));
            }
          },
        },
      });

      const proxy = { p: 0 };
      tl.to(proxy, { p: 1, ease: "none", duration: 1, onUpdate: () => setProgress(proxy.p) }, 0);

      tl.to(cueRef.current, { autoAlpha: 0, duration: 0.05 }, 0.08);

      // Text arrival — headline cascades in tightly, then copy + CTAs land.
      tl.to(eyebrowRef.current, { y: 0, autoAlpha: 1, duration: 0.04 }, 0.4);
      tl.fromTo(
        letters,
        { yPercent: 120, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ease: "power3.out", duration: 0.09, stagger: { amount: 0.1 } },
        0.44,
      );
      tl.to(taglineRef.current, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.64);
      tl.to(ctaRef.current, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.68);

      // Gold accent bleeds in for the full composition.
      tl.to(glowRef.current, { autoAlpha: 1, duration: 0.18, ease: "power1.out" }, 0.58);

      // Transition out — compress + fade everything for the dawn handoff.
      tl.to(textInnerRef.current, { yPercent: -6, scale: 0.97, duration: 0.12 }, 0.88);
      tl.to(
        [textWrapRef.current, glowRef.current, vignetteRef.current, hudRef.current],
        { autoAlpha: 0, duration: 0.1 },
        0.88,
      );
    }, root);

    window.dispatchEvent(new Event("hero:enter"));
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeRaf);
      ctxGsap.revert();
      window.dispatchEvent(new Event("hero:leave"));
    };
  }, []);

  return (
    <section ref={rootRef} className="relative bg-[#0a0b0d] text-cream-50">
      <div ref={pinRef} className="relative h-[100svh] w-full overflow-hidden">
        {/* Survey geometry */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

        {/* Warm gold accent bleed (golden hour) */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(55% 42% at 50% 86%, rgba(196,163,104,0.5), transparent 62%), radial-gradient(42% 36% at 80% 76%, rgba(232,212,168,0.26), transparent 60%)",
          }}
        />

        {/* Legibility + depth vignette */}
        <div
          ref={vignetteRef}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(46% 32% at 50% 47%, rgba(8,9,12,0.62), transparent 72%), radial-gradient(118% 88% at 50% 40%, transparent 46%, rgba(5,8,12,0.55) 100%), linear-gradient(to bottom, rgba(10,11,13,0.5), transparent 22%, transparent 74%, rgba(10,11,13,0.8))",
          }}
        />

        {/* Cartouche / survey stamp */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute left-6 top-24 hidden items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-gold-400/60 md:flex"
        >
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
            <h1 className="mt-6 font-display text-[2.6rem] font-light leading-[1.05] tracking-tight text-cream-50 sm:text-6xl md:text-7xl lg:text-[5rem]">
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
            <div
              ref={ctaRef}
              className="mt-9 flex flex-col items-center justify-center gap-3 opacity-0 sm:flex-row"
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
        <div
          ref={cueRef}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-cream-200/50">
            Scroll
          </span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold-400/80 to-transparent" />
        </div>

        {/* Sequence progress bar (reads as a survey scale bar) */}
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
