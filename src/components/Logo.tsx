import Link from "next/link";

type Props = {
  variant?: "light" | "dark"; // light = for dark backgrounds
  className?: string;
  href?: string | null;
};

/**
 * Wordmark for Rubens Capital Partners — a monogram "RCP" mark in a
 * gold-ruled square beside the full name. Pure SVG/CSS, no asset files,
 * so it renders identically on static hosting.
 */
export default function Logo({ variant = "dark", className = "", href = "/" }: Props) {
  const isLight = variant === "light";
  const ink = isLight ? "text-cream-50" : "text-ink-900";
  const sub = isLight ? "text-cream-200/70" : "text-ink-600/70";

  const content = (
    <span className={`group inline-flex items-center gap-3 ${className}`}>
      <span className="relative grid h-10 w-10 place-items-center">
        <span className="absolute inset-0 rounded-[3px] border border-gold-500/70 transition-colors duration-500 group-hover:border-gold-400" />
        <span className="absolute inset-[3px] rounded-[2px] bg-gold-500/10" />
        <span className="font-display text-[0.95rem] leading-none tracking-tight text-gold-500">
          R
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.05rem] tracking-tight ${ink}`}>
          Rubens Capital
        </span>
        <span className={`mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.32em] ${sub}`}>
          Partners
        </span>
      </span>
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} aria-label="Rubens Capital Partners — home">
      {content}
    </Link>
  );
}
