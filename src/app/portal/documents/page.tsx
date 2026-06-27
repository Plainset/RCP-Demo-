"use client";

import { useMemo, useState } from "react";
import { PortalPageTop, Badge } from "@/components/portal-ui";
import { documents, shortDate, type Doc } from "@/lib/portal";

const categories = ["All", "Quarterly Report", "Capital Account", "Capital Call Notice", "Tax", "Legal"] as const;
type Cat = (typeof categories)[number];

const catTone: Record<Doc["category"], "neutral" | "positive" | "warn" | "gold"> = {
  "Quarterly Report": "gold",
  "Capital Account": "neutral",
  "Capital Call Notice": "warn",
  Tax: "positive",
  Legal: "neutral",
};

export default function DocumentsPage() {
  const [cat, setCat] = useState<Cat>("All");
  const [toast, setToast] = useState<string | null>(null);

  const rows = useMemo(
    () => (cat === "All" ? documents : documents.filter((d) => d.category === cat)),
    [cat]
  );

  function download(title: string) {
    setToast(`"${title}" — download is disabled in this demo.`);
    window.clearTimeout((download as unknown as { _t?: number })._t);
    (download as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2600);
  }

  return (
    <>
      <PortalPageTop title="Documents" subtitle="Reports, statements and notices for your funds.">
        <button className="btn btn-ink text-[0.68rem]" onClick={() => download("All documents (ZIP)")}>
          Download all
        </button>
      </PortalPageTop>

      <div className="space-y-6 px-6 py-8 md:px-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                cat === c
                  ? "bg-ink-950 text-cream-50"
                  : "border border-ink-900/12 text-ink-600 hover:border-gold-500/50 hover:text-ink-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-sm border border-ink-900/10 bg-white">
          <ul className="divide-y divide-ink-900/6">
            {rows.map((d) => (
              <li
                key={d.id}
                className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cream-50 sm:flex-row sm:items-center"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-ink-900/5 text-ink-500">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6">
                    <path d="M14 3v5h5" />
                    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5Z" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-ink-900">{d.title}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
                    <span>{d.fund}</span>
                    <span className="text-ink-300">·</span>
                    <span>{shortDate(d.date)}</span>
                    <span className="text-ink-300">·</span>
                    <span>{d.size}</span>
                  </div>
                </div>
                <Badge tone={catTone[d.category]}>{d.category}</Badge>
                <button
                  onClick={() => download(d.title)}
                  className="shrink-0 rounded-sm border border-ink-900/12 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ink-700 transition-colors hover:border-gold-500/60 hover:text-gold-700"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-ink-500">
          Documents shown are illustrative placeholders for this demo. In a live
          deployment these would be securely served per-investor.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-sm bg-ink-950 px-5 py-3 text-sm text-cream-50 shadow-2xl">
          {toast}
        </div>
      )}
    </>
  );
}
