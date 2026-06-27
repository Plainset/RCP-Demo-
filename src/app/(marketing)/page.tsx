import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CTABand from "@/components/CTABand";
import ScrollHero from "@/components/ScrollHero";
import CountUp from "@/components/CountUp";
import { company, stats, strategies, services } from "@/lib/site";

const PORTAL_IMG =
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1400&q=80";

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------- Hero */}
      <ScrollHero />

      {/* ----------------------------------------------------- Stat band */}
      <section className="border-b border-ink-900/10 bg-cream-100">
        {/* Gold hairline echoing the hero's survey datum line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-500/55 to-transparent" />
        <div className="shell grid grid-cols-2 gap-px md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 90}
              className="px-2 py-10 text-center md:px-6 md:py-14"
            >
              <CountUp
                className="font-display text-4xl text-ink-900 md:text-5xl"
                to={s.to}
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
                decimals={s.decimals}
                commas={s.commas}
              />
              <div className="mt-3 text-[0.82rem] font-semibold uppercase tracking-wide text-ink-700">
                {s.label}
              </div>
              {s.sub && <div className="mt-1 text-[0.78rem] text-ink-600/70">{s.sub}</div>}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- Positioning */}
      <section className="bg-cream-50 py-24 md:py-32">
        <div className="shell grid gap-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6 md:pr-8">
            <SectionHeading
              eyebrow="Who we are"
              title={
                <>
                  Independent by design,
                  <br /> aligned by principle.
                </>
              }
            />
            <Reveal delay={120}>
              <p className="mt-6 max-w-xl leading-relaxed text-ink-700">{company.intro}</p>
              <p className="mt-4 max-w-xl leading-relaxed text-ink-700">
                We combine disciplined capital allocation with deep operational
                control of the assets we manage — owning the full value chain
                from acquisition and underwriting through to active asset
                management and exit.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-700 transition-colors hover:text-gold-600"
              >
                More about the firm
                <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>

          <div className="md:col-span-6">
            <div className="grid gap-px overflow-hidden rounded-sm border border-ink-900/10 bg-ink-900/10 sm:grid-cols-2">
              {[
                { k: "Independent", v: "No conflicts, no house product — only our investors' mandates." },
                { k: "Owner-operator", v: "We manage every asset we acquire, in-house and hands-on." },
                { k: "Through cycles", v: "Two decades of investing across Dutch and US real estate." },
                { k: "Regulated", v: "AFM-licensed manager with full SFDR & ESG disclosure." },
              ].map((p, i) => (
                <Reveal
                  key={p.k}
                  delay={i * 90}
                  className="bg-cream-50 p-7 transition-colors duration-300 hover:bg-white"
                >
                  <div className="font-display text-xl text-ink-900">{p.k}</div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.v}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Strategies */}
      <section className="bg-ink-950 py-24 text-cream-50 md:py-32">
        <div className="shell">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              tone="light"
              eyebrow="What we manage"
              title="Four strategies, one discipline."
              intro="A diversified real estate platform spanning residential, offices and care housing in the Netherlands, and multifamily in the United States."
            />
            <Reveal delay={150}>
              <Link href="/portfolio" className="btn btn-ghost-light whitespace-nowrap">
                View the portfolio
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {strategies.map((s, i) => (
              <Reveal key={s.slug} delay={i * 90}>
                <Link
                  href="/portfolio"
                  className="group relative block aspect-[3/4] overflow-hidden rounded-sm"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${s.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-400">
                      {s.geography}
                    </div>
                    <div className="mt-1.5 font-display text-xl leading-tight">{s.name}</div>
                    <div className="mt-3 flex items-baseline gap-2 text-cream-200/80">
                      <span className="font-display text-2xl text-cream-50">{s.aum}</span>
                      <span className="text-xs">· {s.units}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- Capabilities */}
      <section className="bg-cream-50 py-24 md:py-32">
        <div className="shell">
          <SectionHeading
            eyebrow="How we create value"
            title="A fully integrated capability set."
            intro="From the first underwrite to the final disposal, we own every step of the value chain in-house — the source of both our control and our edge."
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

      {/* ------------------------------------------ Investor portal */}
      <section className="relative overflow-hidden bg-ink-900 py-24 text-cream-50 md:py-32">
        <div className="shell grid gap-12 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <SectionHeading
              tone="light"
              eyebrow="For our institutional investors"
              title="Your portfolio, with total transparency."
              intro="A secure investor portal giving our institutional partners a real-time view of commitments, capital activity, performance and reporting — all in one place."
            />
            <ul className="mt-8 space-y-4">
              {[
                "Live portfolio NAV, contributions and distributions",
                "Fund-by-fund performance: IRR, MOIC, DPI and TVPI",
                "Capital calls & distribution notices as they happen",
                "A complete document vault — reports, statements and tax packs",
              ].map((f, i) => (
                <Reveal as="li" key={f} delay={i * 80} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500" />
                  <span className="text-cream-200/80">{f}</span>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={120}>
              <Link href="/login" className="btn btn-gold mt-9">
                Enter the investor portal
              </Link>
            </Reveal>
          </div>

          <Reveal delay={150} className="md:col-span-6">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-sm opacity-20 blur-2xl"
                style={{ background: "radial-gradient(circle, #c4a368, transparent 70%)" }}
              />
              <div className="relative overflow-hidden rounded-md border border-cream-100/10 shadow-2xl">
                <img
                  src={PORTAL_IMG}
                  alt="Modern architecture representing the RCP portfolio"
                  className="h-48 w-full object-cover"
                />
                <div className="bg-ink-950 p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-widest text-cream-200/50">
                      Portfolio value
                    </div>
                    <div className="text-[0.7rem] text-gold-400">As of 30 Jun 2026</div>
                  </div>
                  <div className="mt-2 font-display text-4xl text-cream-50">€125.7m</div>
                  <div className="mt-1 text-sm text-positive">▲ Net IRR 11.4% · TVPI 1.43×</div>
                  <div className="mt-6 grid grid-cols-3 gap-3 border-t border-cream-100/10 pt-5 text-center">
                    {[
                      ["Commitment", "€120m"],
                      ["Distributed", "€25.7m"],
                      ["Unfunded", "€14.3m"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div className="font-display text-lg text-cream-50">{v}</div>
                        <div className="mt-0.5 text-[0.62rem] uppercase tracking-wider text-cream-200/45">
                          {k}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- CTA */}
      <CTABand
        eyebrow="Speak with us"
        title="Considering Rubens Capital Partners as your manager?"
        body="We work with a select group of institutional investors and family offices. We would be glad to discuss your mandate."
        primary={{ label: "Contact the team", href: "/contact" }}
        secondary={{ label: "Investor login", href: "/login" }}
      />
    </>
  );
}
