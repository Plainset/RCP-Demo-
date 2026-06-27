import Link from "next/link";
import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export default function CTABand({
  eyebrow = "Get in touch",
  title,
  body,
  primary = { label: "Contact the team", href: "/contact" },
  secondary = { label: "Investor login", href: "/login" },
}: Props) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-cream-50">
      <div className="bg-grain absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #c4a368 0%, transparent 70%)" }}
      />
      <div className="shell relative grid gap-10 py-20 md:grid-cols-12 md:items-center md:py-28">
        <Reveal className="md:col-span-8">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 className="mt-5 max-w-2xl font-display text-3xl leading-[1.1] text-balance sm:text-4xl md:text-[2.9rem]">
            {title}
          </h2>
          {body && <p className="mt-5 max-w-xl text-cream-200/70">{body}</p>}
        </Reveal>
        <Reveal
          className="flex flex-col gap-3 md:col-span-4 md:items-end"
          delay={120}
        >
          <Link href={primary.href} className="btn btn-gold w-full md:w-auto">
            {primary.label}
          </Link>
          <Link href={secondary.href} className="btn btn-ghost-light w-full md:w-auto">
            {secondary.label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
