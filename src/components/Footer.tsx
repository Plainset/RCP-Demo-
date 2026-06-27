import Link from "next/link";
import Logo from "./Logo";
import { company, navLinks, compliance } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-cream-100">
      <div className="shell grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo variant="light" href={null} />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream-200/60">
            {company.tagline} Investing on behalf of institutional investors and
            family offices across the Netherlands and the United States.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-500">
            Navigate
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-cream-200/70 transition-colors hover:text-gold-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="text-cream-200/70 transition-colors hover:text-gold-300"
              >
                Investor Login
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-500">
            Amsterdam
          </p>
          <address className="mt-5 space-y-1 text-sm not-italic leading-relaxed text-cream-200/70">
            <div>{company.address.line1}</div>
            <div>{company.address.line2}</div>
            <div>{company.address.city}</div>
            <div>{company.address.country}</div>
          </address>
          <div className="mt-5 space-y-1 text-sm">
            <a
              href={`tel:${company.phoneHref}`}
              className="block text-cream-200/70 transition-colors hover:text-gold-300"
            >
              {company.phone}
            </a>
            <a
              href={`mailto:${company.email}`}
              className="block text-cream-200/70 transition-colors hover:text-gold-300"
            >
              {company.email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream-100/10">
        <div className="shell flex flex-col gap-4 py-6 text-[0.72rem] text-cream-200/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {company.established}–2026 {company.name}. All rights reserved. AFM
            licensed manager.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {compliance.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-300"
                >
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="shell pb-6">
          <p className="text-[0.66rem] leading-relaxed text-cream-200/35">
            Demo website built as a concept pitch. Not affiliated with Rubens
            Capital Partners. All portfolio and investor figures shown in the
            login area are illustrative sample data.
          </p>
        </div>
      </div>
    </footer>
  );
}
