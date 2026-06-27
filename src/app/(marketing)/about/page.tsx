import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { company, stats, services, compliance } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Rubens Capital Partners is an independent real estate asset and investment management firm with €4.0bn AUM across the Netherlands and the United States.",
};

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1460472178825-e5240623afd5?auto=format&fit=crop&w=2000&q=80";

const timeline = [
  { year: "2004", text: "Rubens Capital Partners is founded in Amsterdam as an independent real estate investment platform." },
  { year: "2017", text: "Awarded its AFM license and launches its first US multifamily strategy alongside local operating partners." },
  { year: "2021", text: "Expands into senior & care housing, adding a demographically-driven, impact-aligned strategy." },
  { year: "2026", text: "Manages €4.0bn across four strategies for institutional investors and family offices." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the firm"
        title={
          <>
            Two decades of disciplined
            <br /> real estate investing.
          </>
        }
        intro="We are an independent asset and investment manager — owning the full value chain from acquisition through to active management and exit."
        image={ABOUT_IMG}
      />

      {/* Intro / philosophy */}
      <section className="bg-cream-50 py-24 md:py-32">
        <div className="shell grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <SectionHeading eyebrow="Our philosophy" title="Aligned capital, owned outcomes." />
          </div>
          <Reveal className="space-y-5 text-ink-700 md:col-span-7 md:pt-2">
            <p className="leading-relaxed">{company.intro}</p>
            <p className="leading-relaxed">
              Independence is the foundation of how we operate. We hold no house
              product to place and no conflicts to manage — only the mandates our
              investors entrust to us. That alignment lets us underwrite with
              honesty and hold with conviction.
            </p>
            <p className="leading-relaxed">
              Because we manage every asset we acquire, our investment teams and
              asset managers sit side by side. Decisions are informed by
              on-the-ground operational reality, not by a spreadsheet alone — and
              value is created through hands-on work, not financial engineering.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-ink-900/10 bg-cream-100">
        <div className="shell grid grid-cols-2 gap-px md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="px-2 py-10 text-center md:py-14">
              <div className="font-display text-4xl text-ink-900 md:text-5xl">{s.value}</div>
              <div className="mt-3 text-[0.82rem] font-semibold uppercase tracking-wide text-ink-700">
                {s.label}
              </div>
              {s.sub && <div className="mt-1 text-[0.78rem] text-ink-600/70">{s.sub}</div>}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-ink-950 py-24 text-cream-50 md:py-32">
        <div className="shell">
          <SectionHeading tone="light" eyebrow="Our journey" title="Built deliberately, over cycles." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-cream-100/10 bg-cream-100/10 md:grid-cols-4">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 100} className="bg-ink-950 p-8">
                <div className="font-display text-3xl text-gold-400">{t.year}</div>
                <div className="mt-4 h-px w-10 bg-gold-500/50" />
                <p className="mt-4 text-sm leading-relaxed text-cream-200/70">{t.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services full list */}
      <section className="bg-cream-50 py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow="What we do"
            title="An integrated capability, end to end."
            intro="Eight disciplines, delivered in-house — the reason we retain control of quality and value at every stage of an asset's life."
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-sm border border-ink-900/10 bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((svc, i) => (
              <Reveal
                key={svc.title}
                delay={(i % 4) * 80}
                className="group bg-cream-50 p-7 transition-colors duration-300 hover:bg-white"
              >
                <div className="font-display text-2xl text-gold-600/40 transition-colors group-hover:text-gold-500">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-3 font-display text-lg text-ink-900">{svc.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{svc.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Governance / compliance */}
      <section className="bg-cream-100 py-24 md:py-28">
        <div className="shell grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <SectionHeading
              eyebrow="Governance"
              title="Regulated, transparent, accountable."
              intro="Rubens Capital Partners is an AFM-licensed manager. Our governance and disclosure framework is available to investors and counterparties."
            />
          </div>
          <Reveal delay={120} className="md:col-span-7">
            <ul className="grid gap-px overflow-hidden rounded-sm border border-ink-900/10 bg-ink-900/10 sm:grid-cols-2">
              {compliance.map((c) => {
                const inner = (
                  <>
                    <span className="text-sm font-medium text-ink-800">{c.label}</span>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gold-600">
                      {c.href ? "View" : "PDF"}
                    </span>
                  </>
                );
                const cls =
                  "flex items-center justify-between gap-4 bg-cream-50 px-6 py-5 transition-colors hover:bg-white";
                return (
                  <li key={c.label}>
                    {c.href ? (
                      <Link href={c.href} className={cls}>
                        {inner}
                      </Link>
                    ) : (
                      <div className={cls}>{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      <CTABand
        title="Let's talk about your mandate."
        body="We work with a select group of institutional investors. We'd welcome a conversation."
      />
    </>
  );
}
