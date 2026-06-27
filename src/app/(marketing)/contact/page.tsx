import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import MapEmbed from "@/components/MapEmbed";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Rubens Capital Partners — Atrium South Tower, Parnassusweg 729, Amsterdam.",
};

const CONTACT_IMG =
  "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=2000&q=80";

const directions = [
  {
    head: "By car",
    body: "From the A10 ring road, take exit S109 (Amsterdam-Zuid / RAI). Parking is available at the Atrium garage on Strawinskylaan.",
  },
  {
    head: "By public transport",
    body: "Amsterdam Zuid / WTC station is a short walk away — served by metro lines 50, 51 and 52 and by direct trains from Schiphol Airport.",
  },
  {
    head: "On arrival",
    body: "Collect a visitor pass at the central reception of the Atrium building; we are on the 10th floor of the South Tower.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's start a conversation."
        intro="Whether you're an existing investor or exploring a mandate, we'd be glad to hear from you."
        image={CONTACT_IMG}
      />

      <section className="bg-cream-50 py-24 md:py-28">
        <div className="shell grid gap-14 md:grid-cols-12 md:gap-12">
          {/* Details */}
          <div className="md:col-span-5">
            <Reveal>
              <span className="eyebrow">Amsterdam office</span>
              <h2 className="mt-4 font-display text-3xl text-ink-900">Rubens Capital Partners B.V.</h2>
              <address className="mt-6 space-y-1 not-italic leading-relaxed text-ink-700">
                <div>{company.address.line1}</div>
                <div>{company.address.line2}</div>
                <div>{company.address.city}</div>
                <div>{company.address.country}</div>
              </address>

              <div className="mt-8 space-y-4">
                <a
                  href={`tel:${company.phoneHref}`}
                  className="flex items-center gap-4 border-b border-ink-900/10 pb-4 text-ink-800 transition-colors hover:text-gold-700"
                >
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-gold-600">
                    Phone
                  </span>
                  <span className="font-medium">{company.phone}</span>
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-4 border-b border-ink-900/10 pb-4 text-ink-800 transition-colors hover:text-gold-700"
                >
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-gold-600">
                    Email
                  </span>
                  <span className="font-medium">{company.email}</span>
                </a>
              </div>

              <div className="mt-10 space-y-6">
                {directions.map((d) => (
                  <div key={d.head}>
                    <h3 className="font-display text-lg text-ink-900">{d.head}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{d.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="md:col-span-7">
            <Reveal delay={120} className="card p-7 md:p-9">
              <h2 className="font-display text-2xl text-ink-900">Send us a message</h2>
              <p className="mt-1.5 text-sm text-ink-600">
                We typically respond within one business day.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-cream-100">
        <Reveal className="relative h-[420px] w-full overflow-hidden border-y border-ink-900/10">
          <MapEmbed />
        </Reveal>
      </section>
    </>
  );
}
