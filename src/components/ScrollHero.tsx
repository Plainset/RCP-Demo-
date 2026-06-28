"use client";

/* ------------------------------------------------------------------ *
 *  ScrollHero — a full-screen, scroll-driven cinematic hero.
 *
 *  Concept: "The View from Amsterdam Zuid." The camera starts INSIDE a
 *  dark, high-floor Zuidas office, framed by a floor-to-ceiling window
 *  that looks out onto the Amsterdam Zuid skyline at golden hour. As the
 *  user scrolls, the camera pushes forward — the dark interior + window
 *  mullions scale up and slide past the lens, the glass tint clears, and
 *  the skyline opens up to fill the frame. The headline then lands over
 *  the city, and a dawn dissolve hands off to the cream page below.
 *
 *  Pinned (~340vh); scroll progress (0→1) drives one GSAP timeline.
 *  Pure DOM transform/opacity (GPU, 60fps) — no canvas, no video. The
 *  skyline is a self-hosted Unsplash photo (copyright-free), so it stays
 *  within img-src 'self'. Honours prefers-reduced-motion (static composed
 *  frame) and simplifies the window on mobile. GSAP is bundled (no CDN).
 *
 *  Photo: Amsterdam Zuid / Zuidas — Lennart Schulz (Unsplash License).
 * ------------------------------------------------------------------ */

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/site";

const NAME = "RUBENS CAPITAL PARTNERS";
const LINE_1 = "Built to last.";
const LINE_2 = "Managed to perform.";

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Letters grouped into non-breaking words so a line never splits mid-word. */
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
  const skylineRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const dawnRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const textInnerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letters = root.querySelectorAll<HTMLElement>(".hero-letter");

    const setBar = (p: number) => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${clamp01(p)})`;
        barRef.current.style.opacity = p > 0.9 ? `${1 - (p - 0.9) / 0.1}` : "1";
      }
    };

    // The window rectangle (as % of viewport) the perspective room recedes to.
    // Smaller on desktop (deeper room), larger on mobile so the view reads.
    const setRoomVars = () => {
      const el = interiorRef.current;
      if (!el) return;
      const m = window.innerWidth < 768;
      el.style.setProperty("--wx0", m ? "22%" : "35%");
      el.style.setProperty("--wx1", m ? "78%" : "65%");
      el.style.setProperty("--wy0", m ? "34%" : "29%");
      el.style.setProperty("--wy1", m ? "66%" : "71%");
    };
    setRoomVars();
    window.addEventListener("resize", setRoomVars);

    /* ---- Reduced motion: composed final frame (out the window) --- */
    if (reduce) {
      gsap.set(skylineRef.current, { scale: 1.12 });
      gsap.set([glassRef.current, interiorRef.current, hudRef.current, cueRef.current], {
        autoAlpha: 0,
      });
      gsap.set([scrimRef.current, glowRef.current], { autoAlpha: 1 });
      gsap.set(letters, { y: 0, autoAlpha: 1 });
      gsap.set([eyebrowRef.current, taglineRef.current, ctaRef.current], { y: 0, autoAlpha: 1 });
      gsap.set(dawnRef.current, { autoAlpha: 0 });
      if (barRef.current) barRef.current.style.opacity = "0";

      window.dispatchEvent(new Event("hero:enter"));
      let past = false;
      const onScroll = () => {
        const isPast = window.scrollY > window.innerHeight - 80;
        if (isPast !== past) {
          past = isPast;
          window.dispatchEvent(new Event(past ? "hero:leave" : "hero:enter"));
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", setRoomVars);
        window.dispatchEvent(new Event("hero:leave"));
      };
    }

    /* ---- Scroll-driven timeline --------------------------------- */
    const ctxGsap = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(skylineRef.current, { scale: 1.04, transformOrigin: "50% 45%" });
      gsap.set(glassRef.current, { autoAlpha: 1 });
      gsap.set(interiorRef.current, { scale: 1, autoAlpha: 1, transformOrigin: "50% 50%" });
      gsap.set([glowRef.current, scrimRef.current, dawnRef.current], { autoAlpha: 0 });
      gsap.set([eyebrowRef.current, taglineRef.current, ctaRef.current], { y: 18, autoAlpha: 0 });

      let headerPast = false;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=340%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setBar(self.progress);
            const past = self.progress > 0.9;
            if (past !== headerPast) {
              headerPast = past;
              window.dispatchEvent(new Event(past ? "hero:leave" : "hero:enter"));
            }
          },
        },
      });

      // The push: skyline drifts forward slowly (far); interior rushes past
      // (near) and fades; the glass tint clears as we exit.
      tl.to(skylineRef.current, { scale: 1.22, ease: "none", duration: 1 }, 0);
      tl.to(glassRef.current, { autoAlpha: 0, duration: 0.48, ease: "power1.inOut" }, 0.08);
      tl.to(interiorRef.current, { scale: 9, ease: "power2.in", duration: 0.66 }, 0.04);
      tl.to(interiorRef.current, { autoAlpha: 0, duration: 0.2, ease: "power1.out" }, 0.5);

      tl.to(cueRef.current, { autoAlpha: 0, duration: 0.05 }, 0.08);
      tl.to(hudRef.current, { autoAlpha: 0, duration: 0.1 }, 0.4);

      // Out over the city: scrim for legibility, then the engineered reveal.
      tl.to(scrimRef.current, { autoAlpha: 1, duration: 0.14 }, 0.56);
      tl.to(glowRef.current, { autoAlpha: 1, duration: 0.18, ease: "power1.out" }, 0.62);
      tl.to(eyebrowRef.current, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.6);
      tl.fromTo(
        letters,
        { yPercent: 120, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ease: "power3.out", duration: 0.08, stagger: { amount: 0.1 } },
        0.63,
      );
      tl.to(taglineRef.current, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.78);
      tl.to(ctaRef.current, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.82);

      // Dawn dissolve to cream for the hand-off.
      tl.to(textInnerRef.current, { yPercent: -5, duration: 0.12 }, 0.9);
      tl.to(dawnRef.current, { autoAlpha: 1, duration: 0.12 }, 0.9);
      tl.to([textWrapRef.current, glowRef.current, scrimRef.current], { autoAlpha: 0, duration: 0.1 }, 0.92);
    }, root);

    window.dispatchEvent(new Event("hero:enter"));
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ctxGsap.revert();
      window.removeEventListener("resize", setRoomVars);
      window.dispatchEvent(new Event("hero:leave"));
    };
  }, []);

  return (
    <section ref={rootRef} className="relative bg-[#0a0b0d] text-cream-50">
      <div ref={pinRef} className="relative h-[100svh] w-full overflow-hidden">
        {/* Skyline (the view through the window) */}
        <div
          ref={skylineRef}
          className="absolute inset-0 z-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${asset("/hero/zuid-skyline.jpg")})`, backgroundPosition: "50% 42%" }}
          aria-hidden="true"
        />

        {/* Behind-glass tint (dusk / reflection), clears as we exit */}
        <div
          ref={glassRef}
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,20,34,0.5), rgba(8,12,22,0.62)), linear-gradient(120deg, rgba(220,230,255,0.07), transparent 42%)",
          }}
          aria-hidden="true"
        />

        {/* The office interior — a one-point-perspective room (floor, ceiling,
            side walls) receding to the window, lit by the skyline. The whole
            room scales past the lens on scroll (dolly through the window). */}
        <div ref={interiorRef} className="pointer-events-none absolute inset-0 z-[2] will-change-transform" aria-hidden="true">
          {/* ceiling — with linear light reflecting toward the window */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, var(--wx1) var(--wy0), var(--wx0) var(--wy0))",
              background:
                "radial-gradient(46% 86% at 50% 100%, rgba(255,206,150,0.10), transparent 70%), linear-gradient(to bottom, #060709, #14110c)",
            }}
          />
          {/* floor — polished, catching warm light reflected from the window */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0% 100%, 100% 100%, var(--wx1) var(--wy1), var(--wx0) var(--wy1))",
              background:
                "radial-gradient(40% 92% at 50% 0%, rgba(255,198,138,0.16), transparent 72%), linear-gradient(to top, #050608, #17130d)",
            }}
          />
          {/* left wall */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0% 0%, var(--wx0) var(--wy0), var(--wx0) var(--wy1), 0% 100%)",
              background: "linear-gradient(to right, #060709, #16130d)",
            }}
          />
          {/* right wall */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(100% 0%, var(--wx1) var(--wy0), var(--wx1) var(--wy1), 100% 100%)",
              background: "linear-gradient(to left, #060709, #16130d)",
            }}
          />
          {/* window frame + warm light spill + mullions */}
          <div
            className="absolute"
            style={{
              left: "var(--wx0)",
              right: "calc(100% - var(--wx1))",
              top: "var(--wy0)",
              bottom: "calc(100% - var(--wy1))",
              border: "1px solid #20242a",
              boxShadow:
                "inset 0 0 90px 10px rgba(255,196,128,0.16), 0 0 80px 16px rgba(255,186,120,0.12)",
            }}
          >
            <div className="absolute inset-y-0 left-1/3 w-[2px] bg-[#1a1d22]" />
            <div className="absolute inset-y-0 left-2/3 w-[2px] bg-[#1a1d22]" />
            <div className="absolute inset-x-0 top-1/2 h-[2px] bg-[#1a1d22]" />
          </div>
        </div>

        {/* Warm gold accent (golden hour) — bleeds in over the city */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 z-[3] opacity-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(60% 50% at 78% 30%, rgba(255,196,128,0.4), transparent 60%), radial-gradient(50% 40% at 50% 90%, rgba(196,163,104,0.3), transparent 65%)",
          }}
          aria-hidden="true"
        />

        {/* Legibility scrim behind the headline + header */}
        <div
          ref={scrimRef}
          className="pointer-events-none absolute inset-0 z-[4] opacity-0"
          style={{
            background:
              "radial-gradient(60% 42% at 50% 52%, rgba(6,9,14,0.62), transparent 72%), linear-gradient(to bottom, rgba(8,10,14,0.55), transparent 26%, transparent 70%, rgba(8,10,14,0.6))",
          }}
          aria-hidden="true"
        />

        {/* Cartouche */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute left-6 top-24 z-[6] hidden items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-cream-100/70 md:flex"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400/80" />
          Amsterdam Zuid
        </div>

        {/* Text */}
        <div ref={textWrapRef} className="absolute inset-0 z-[5] grid place-items-center px-6">
          <div ref={textInnerRef} className="w-full max-w-5xl text-center will-change-transform">
            <span
              ref={eyebrowRef}
              className="block text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-gold-300/95 opacity-0 sm:text-xs"
            >
              {NAME}
            </span>
            <h1 className="mt-6 font-display text-[2.6rem] font-light leading-[1.05] tracking-tight text-cream-50 drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-6xl md:text-7xl lg:text-[5rem]">
              <Letters text={LINE_1} />
              <span className="text-gold-300">
                <Letters text={LINE_2} />
              </span>
            </h1>
            <p
              ref={taglineRef}
              className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-cream-100/85 opacity-0 drop-shadow-[0_1px_12px_rgba(0,0,0,0.5)] sm:text-lg"
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
          className="absolute bottom-8 left-1/2 z-[6] flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-cream-100/60">
            Scroll
          </span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold-300/80 to-transparent" />
        </div>

        {/* Progress bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-px bg-cream-100/10">
          <div
            ref={barRef}
            className="h-full origin-left bg-gradient-to-r from-gold-500 to-gold-300"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Dawn dissolve to cream */}
        <div ref={dawnRef} className="pointer-events-none absolute inset-0 z-[20] bg-cream-50 opacity-0" aria-hidden="true" />
      </div>
    </section>
  );
}
