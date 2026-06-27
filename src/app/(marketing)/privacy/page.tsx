import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { company } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Statement",
  description:
    "Privacy statement for the Rubens Capital Partners concept demo website.",
};

const PRIVACY_IMG =
  "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&w=2000&q=80";

const sections: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "About this site",
    body: (
      <>
        This is a <strong>concept / demonstration website</strong> built as a design
        pitch. It is <strong>not affiliated with, operated by, or endorsed by</strong>{" "}
        Rubens Capital Partners. Company information shown publicly was reconstructed
        from publicly available sources to illustrate a redesign.
      </>
    ),
  },
  {
    heading: "No data is collected by us",
    body: (
      <>
        This site is a static website with no application server, database or
        analytics. The contact form does <strong>not transmit or store</strong> any
        information — submitting it only shows a confirmation message in your browser.
        We set no first-party cookies and run no tracking.
      </>
    ),
  },
  {
    heading: "Investor portal & sample data",
    body: (
      <>
        The investor portal sign-in is a <strong>mock, client-side demonstration</strong>.
        Any credentials are accepted; a session flag is stored only in your browser&apos;s
        local storage and never sent anywhere. Every portfolio, performance and
        transaction figure shown in the portal is <strong>fictional sample data</strong>{" "}
        — there is no real personal or financial information.
      </>
    ),
  },
  {
    heading: "Third-party content",
    body: (
      <>
        Two third parties may receive your IP address when their content loads:
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>Google Maps</strong> — the office map on the{" "}
            <Link href="/contact" className="text-gold-700 hover:text-gold-600">
              Contact
            </Link>{" "}
            page is <strong>click-to-load</strong>: nothing is requested from Google
            until you choose to load the map, at which point Google may set cookies and
            receive your IP address and referrer.
          </li>
          <li>
            <strong>Unsplash</strong> — photography is served from the Unsplash image
            CDN (<code>images.unsplash.com</code>), which receives your IP address as
            images load, as with any content delivery network.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: "Contact",
    body: (
      <>
        Questions about this demo can be directed to{" "}
        <a href={`mailto:${company.email}`} className="text-gold-700 hover:text-gold-600">
          {company.email}
        </a>
        . For a production deployment, this statement would be replaced with a full
        privacy notice covering lawful basis, retention and data-subject rights.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Statement"
        intro="How this demonstration website handles information — in plain terms."
        image={PRIVACY_IMG}
      />

      <section className="bg-cream-50 py-24 md:py-28">
        <div className="shell max-w-3xl">
          <div className="space-y-12">
            {sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 60}>
                <h2 className="font-display text-2xl text-ink-900">{s.heading}</h2>
                <div className="mt-3 leading-relaxed text-ink-700">{s.body}</div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <p className="mt-16 border-t border-ink-900/10 pt-6 text-xs text-ink-500">
              This is demo content for a concept pitch and is not legal advice or a
              binding privacy notice.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
