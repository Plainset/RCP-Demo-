"use client";

/* ------------------------------------------------------------------ *
 *  ScrollHero — a full-screen, scroll-driven cinematic hero.
 *
 *  Concept: "The View from Amsterdam Zuid." We open INSIDE Rubens Capital
 *  Partners' own office at dusk — desk rows and floor-to-ceiling glass looking
 *  out over the Amsterdam Zuid (Zuidas) skyline. The whole scene is a SINGLE
 *  image (hero-office.webp); on scroll the camera leans slowly toward the
 *  window — the desks slide to the edges as a frame while the skyline opens to
 *  fill the view, and a cool dusk wash clears into warm golden hour. The
 *  headline lands over the city.
 *
 *  Because it is one continuous image throughout, the move never cuts — it
 *  simply pushes in. No compositing, no second skyline layer.
 *
 *  Pinned (~340vh); scroll progress (0→1) drives one GSAP timeline. Pure DOM
 *  transform/opacity (GPU, 60fps) — no canvas/video. Self-hosted asset
 *  (img-src 'self'); honours prefers-reduced-motion. GSAP is bundled.
 *
 *  hero-office.webp: an AI-generated dusk office-over-Zuid scene supplied by
 *  the client, with its baked-in UI painted out and upscaled for Retina.
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

    /* ---- Reduced motion: composed final frame (out the window) --- */
    if (reduce) {
      gsap.set(skylineRef.current, { scale: 1.32, transformOrigin: "50% 40%" });
      gsap.set([glassRef.current, hudRef.current, cueRef.current], {
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
        window.dispatchEvent(new Event("hero:leave"));
      };
    }

    /* ---- Scroll-driven timeline --------------------------------- */
    const ctxGsap = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(skylineRef.current, { scale: 1, transformOrigin: "50% 40%" });
      gsap.set(glassRef.current, { autoAlpha: 1 });
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
            // Flip the header to dark-on-cream only at the very end, as the pin
            // releases and the cream band takes over — the hero stays dark (and
            // the header light) right up to the hand-off.
            const past = self.progress > 0.98;
            if (past !== headerPast) {
              headerPast = past;
              window.dispatchEvent(new Event(past ? "hero:leave" : "hero:enter"));
            }
          },
        },
      });

      // The dolly: one continuous shot. The whole office scene — RCP's own
      // floor, desks and floor-to-ceiling glass — pushes slowly toward the
      // window, the desks sliding to the edges as a frame while the Amsterdam
      // Zuid skyline opens to fill the view. The cool dusk "glass" tint clears
      // as we settle into golden hour. It's a single image throughout, so the
      // move never cuts — the camera simply leans into the city.
      tl.to(skylineRef.current, { scale: 1.5, ease: "none", duration: 1 }, 0);
      tl.to(glassRef.current, { autoAlpha: 0, duration: 0.4, ease: "power1.inOut" }, 0.12);

      tl.to(cueRef.current, { autoAlpha: 0, duration: 0.05 }, 0.06);
      tl.to(hudRef.current, { autoAlpha: 0, duration: 0.1 }, 0.42);

      // Out over the city: scrim for legibility, then the engineered reveal.
      tl.to(scrimRef.current, { autoAlpha: 1, duration: 0.16 }, 0.5);
      tl.to(glowRef.current, { autoAlpha: 1, duration: 0.2, ease: "power1.out" }, 0.56);
      tl.to(eyebrowRef.current, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.55);
      tl.fromTo(
        letters,
        { yPercent: 120, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ease: "power3.out", duration: 0.09, stagger: { amount: 0.12 } },
        0.58,
      );
      tl.to(taglineRef.current, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.74);
      tl.to(ctaRef.current, { y: 0, autoAlpha: 1, duration: 0.05 }, 0.78);

      // No dissolve: the finished composition — the Zuidas skyline under golden
      // hour with the headline over it — holds as the final frame and stays put
      // for the rest of the pin. The cream content band below then scrolls up
      // beneath it (a hard cut) once the pin releases.
    }, root);

    window.dispatchEvent(new Event("hero:enter"));
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ctxGsap.revert();
      window.dispatchEvent(new Event("hero:leave"));
    };
  }, []);

  return (
    <section ref={rootRef} className="relative bg-[#0a0b0d] text-cream-50">
      <div ref={pinRef} className="relative h-[100svh] w-full overflow-hidden">
        {/* The single hero scene — RCP's own office at dusk: desks and
            floor-to-ceiling glass looking out over the Amsterdam Zuid skyline.
            One coherent image that slowly pushes toward the window on scroll. */}
        <div
          ref={skylineRef}
          className="absolute inset-0 z-0 bg-cover will-change-transform"
          style={{ backgroundImage: `url(${asset("/hero/hero-office.webp")})`, backgroundPosition: "50% 50%" }}
          aria-hidden="true"
        />

        {/* "Glass": a light cool dusk wash over the scene that lifts on scroll
            so the city warms into golden hour. Kept subtle — the image is
            already graded, so this only nudges the mood (no backdrop-filter,
            which would desaturate the whole opaque scene). */}
        <div
          ref={glassRef}
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,20,36,0.16), rgba(8,12,24,0.12)), linear-gradient(115deg, rgba(150,172,196,0.06), transparent 55%)",
          }}
          aria-hidden="true"
        />

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
              <Link href="/login" className="btn btn-gold">
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
