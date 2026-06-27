"use client";

import { useState } from "react";

const MAP_SRC =
  "https://www.google.com/maps?q=Parnassusweg+729,+1077+DG+Amsterdam&output=embed";

/**
 * Privacy-respecting "click-to-load" Google Maps embed.
 *
 * The iframe is NOT rendered until the visitor opts in, so the page makes no
 * contact with Google (no IP, no referrer, no cookies) on initial load. This is
 * the GDPR "two-click" pattern. Once loaded, the iframe is sandboxed and uses a
 * minimal referrer policy.
 */
export default function MapEmbed() {
  const [shown, setShown] = useState(false);

  if (shown) {
    return (
      <iframe
        title="Rubens Capital Partners — Amsterdam office location"
        src={MAP_SRC}
        className="h-full w-full grayscale-[0.2]"
        loading="lazy"
        referrerPolicy="origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShown(true)}
      className="group flex h-full w-full flex-col items-center justify-center gap-4 bg-ink-950 text-center text-cream-50 transition-colors hover:bg-ink-900"
    >
      <span className="grid h-12 w-12 place-items-center rounded-full border border-gold-500/40 text-gold-400 transition-colors group-hover:border-gold-400">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
          <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </span>
      <span className="font-display text-xl">Show interactive map</span>
      <span className="max-w-sm px-6 text-xs leading-relaxed text-cream-200/60">
        Loading the map connects to Google Maps, which may set cookies and receive
        your IP address. Click to load it.
      </span>
    </button>
  );
}
