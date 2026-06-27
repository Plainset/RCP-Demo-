import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { strategies } from "@/lib/site";

export const metadata: Metadata = {
  title: "Strategies & Portfolio",
  description:
    "Rubens Capital Partners manages c. €4.0bn across Dutch residential, US multifamily, Dutch offices and senior & care housing.",
};

const PORTFOLIO_IMG =
  "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=2000&q=80";

const overview = [
  { label: "Total AUM", value: "≈ €4.0bn" },
  { label: "Strategies", value: "4" },
  { label: "Countries", value: "2" },
  { label: "Residential units", value: "14,800" },
];

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Strategies & portfolio"
        title="A diversified real estate platform."
        intro="Approximately €4.0 billion of assets across RCP-initiated funds and separately managed institutional mandates — spanning four complementary strategies in two markets."
        image={PORTFOLIO_IMG}
      />

      {/* Overview band */}
      <section className="border-b border-ink-900/10 bg-cream-100">
        <div className="shell grid grid-cols-2 gap-px md:grid-cols-4">
          {overview.map((o, i) => (
            <Reveal key={o.label} delay={i * 90} className="px-2 py-10 text-center md:py-14">
              <div className="font-display text-3xl text-ink-900 md:text-4xl">{o.value}</div>
              <div className="mt-2 text-[0.78rem] font-semibold uppercase tracking-wide text-ink-700">
                {o.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Allocation note */}
      <section className="bg-cream-50 pt-24 md:pt-32">
        <div className="shell">
          <SectionHeading
            eyebrow="Allocation"
            title="Anchored in Dutch residential, diversified across cycles."
            intro="Our largest exposure is to Dutch residential — a resilient, supply-constrained market — complemented by income-producing offices, demographically-driven care housing, and growth-oriented US multifamily."
          />
        </div>
      </section>

      {/* Strategy rows */}
      <section className="bg-cream-50 py-20 md:py-24">
        <div className="shell space-y-20 md:space-y-28">
          {strategies.map((s, i) => {
            const flipped = i % 2 === 1;
            return (
              <Reveal
                key={s.slug}
                className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                <div className={`relative ${flipped ? "md:order-2" : ""}`}>
                  <div className="overflow-hidden rounded-sm">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="absolute -bottom-5 left-5 flex gap-3 md:left-auto md:right-5">
                    <div className="rounded-sm bg-ink-950 px-5 py-3 text-cream-50 shadow-xl">
                      <div className="font-display text-2xl text-gold-400">{s.aum}</div>
                      <div className="text-[0.62rem] uppercase tracking-wider text-cream-200/60">
                        AUM
                      </div>
                    </div>
                    <div className="rounded-sm bg-white px-5 py-3 shadow-xl ring-1 ring-ink-900/5">
                      <div className="font-display text-2xl text-ink-900">{s.units.split(" ")[0]}</div>
                      <div className="text-[0.62rem] uppercase tracking-wider text-ink-600">
                        {s.units.split(" ").slice(1).join(" ")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={flipped ? "md:order-1" : ""}>
                  <div className="flex items-center gap-3">
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-600">
                      {String(i + 1).padStart(2, "0")} · {s.geography}
                    </span>
                    {s.vintage && (
                      <span className="rounded-full bg-ink-900/5 px-3 py-1 text-[0.66rem] font-medium uppercase tracking-wide text-ink-600">
                        {s.vintage}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-3xl text-ink-900 md:text-4xl">{s.name}</h3>
                  <p className="mt-4 leading-relaxed text-ink-700">{s.blurb}</p>
                  <ul className="mt-6 space-y-3">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm text-ink-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Geographic reach */}
      <section className="bg-ink-950 py-24 text-cream-50 md:py-32">
        <div className="shell">
          <SectionHeading
            tone="light"
            align="center"
            eyebrow="Geographic reach"
            title="An established Dutch core, with international reach."
            intro="Each market is entered deliberately and managed hands-on — a diversified domestic platform built over two decades, alongside a high-growth international strategy executed with trusted local partners."
            className="mx-auto"
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {[
              {
                country: "Netherlands",
                label: "Established core",
                desc: "Two decades building a diversified, supply-constrained Dutch portfolio across residential, offices, and senior & care housing.",
                facts: ["Since 2004", "Residential · Offices · Care", "~14,300 homes"],
              },
              {
                country: "United States",
                label: "International growth",
                desc: "A high-growth multifamily strategy in select US metros, executed hands-on with trusted local operating partners.",
                facts: ["Active since 2017", "Core-plus & value-add", "Sun Belt & gateway metros"],
              },
            ].map((m, i) => (
              <Reveal
                key={m.country}
                delay={i * 110}
                className="flex flex-col rounded-sm border border-cream-100/10 bg-ink-900 p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-2xl">{m.country}</h3>
                  <span className="rounded-full border border-gold-500/40 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-400">
                    {m.label}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-cream-200/70">{m.desc}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {m.facts.map((f) => (
                    <li
                      key={f}
                      className="rounded-full bg-cream-100/[0.06] px-3 py-1.5 text-xs text-cream-200/75"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Invest with us"
        title="Access our strategies."
        body="Existing investors can review live performance in the portal. New institutional investors are welcome to get in touch."
        primary={{ label: "Contact the team", href: "/contact" }}
        secondary={{ label: "Investor login", href: "/login" }}
      />
    </>
  );
}
