import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import PageHero from "@/components/PageHero";
import CTABand from "@/components/CTABand";
import { team, initials, type Member } from "@/lib/site";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The people behind Rubens Capital Partners — an experienced team across investment, asset management, finance and operations.",
};

const TEAM_IMG =
  "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=2000&q=80";

const leadership = team.filter((m) => m.group === "Leadership");
const management = team.filter((m) => m.group === "Management");
const investment = team.filter((m) => m.group === "Investment & Asset Team");

function Avatar({ name, large = false }: { name: string; large?: boolean }) {
  return (
    <div
      className={`grid place-items-center rounded-sm bg-gradient-to-br from-ink-800 to-ink-950 font-display text-gold-400 ${
        large ? "h-16 w-16 text-xl" : "h-12 w-12 text-base"
      }`}
    >
      {initials(name)}
    </div>
  );
}

function LeadCard({ m, i }: { m: Member; i: number }) {
  return (
    <Reveal delay={(i % 2) * 90} className="card group p-7 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <Avatar name={m.name} large />
        <div>
          <h3 className="font-display text-xl leading-tight text-ink-900">{m.name}</h3>
          <div className="mt-1 text-[0.78rem] font-semibold uppercase tracking-wider text-gold-600">
            {m.role}
          </div>
        </div>
      </div>
      {m.bio && <p className="mt-5 text-sm leading-relaxed text-ink-600">{m.bio}</p>}
    </Reveal>
  );
}

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our people"
        title="The team behind the platform."
        intro="An experienced, independent team with deep knowledge across commercial, financial, technical and administrative real estate disciplines."
        image={TEAM_IMG}
      />

      {/* Leadership */}
      <section className="bg-cream-50 py-24 md:py-32">
        <div className="shell">
          <SectionHeading eyebrow="Leadership" title="Partners" />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {leadership.map((m, i) => (
              <LeadCard key={m.name} m={m} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Management */}
      <section className="bg-cream-100 py-20 md:py-24">
        <div className="shell">
          <SectionHeading eyebrow="Management" title="Operations & investor relations" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {management.map((m, i) => (
              <Reveal key={m.name} delay={(i % 4) * 80} className="card p-6">
                <Avatar name={m.name} />
                <h3 className="mt-4 font-display text-lg leading-tight text-ink-900">{m.name}</h3>
                <div className="mt-1 text-[0.72rem] font-semibold uppercase tracking-wider text-gold-600">
                  {m.role}
                </div>
                {m.bio && <p className="mt-3 text-sm leading-relaxed text-ink-600">{m.bio}</p>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Investment & asset team */}
      <section className="bg-cream-50 py-20 md:py-24">
        <div className="shell">
          <SectionHeading
            eyebrow="Investment & Asset Management"
            title="The team in the field"
            intro="Investment and asset managers working hands-on across every strategy and asset we own."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-ink-900/10 bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-4">
            {investment.map((m, i) => (
              <Reveal
                key={m.name}
                delay={(i % 4) * 70}
                className="flex items-center gap-4 bg-cream-50 p-6 transition-colors hover:bg-white"
              >
                <Avatar name={m.name} />
                <div>
                  <h3 className="font-display text-base leading-tight text-ink-900">{m.name}</h3>
                  <div className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wider text-gold-600">
                    {m.role}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        eyebrow="Investor relations"
        title="Speak directly with our team."
        body="Karin Leijnse and the investor relations team are the single point of contact for our institutional partners."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Investor login", href: "/login" }}
      />
    </>
  );
}
