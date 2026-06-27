import Link from "next/link";
import { asset } from "@/lib/site";

type Props = {
  variant?: "light" | "dark"; // kept for API compatibility; the lockup sits on
  className?: string; //          its own brand-blue backdrop, so it reads on any bg
  href?: string | null;
};

/**
 * Official Rubens Capital Partners wordmark (the real white serif lockup,
 * carried over from rubenscapital.nl) presented on the firm's brand-blue
 * backdrop (#0C4776, sampled from their logo mark). Self-hosted PNG so it
 * works under the GitHub Pages base path and the CSP img-src 'self'.
 */
export default function Logo({ className = "", href = "/" }: Props) {
  const content = (
    <span className={`group inline-flex items-center ${className}`}>
      <span className="inline-flex items-center justify-center rounded-[4px] bg-[#0C4776] px-3 py-2 shadow-sm ring-1 ring-white/10 transition-colors duration-500 group-hover:bg-[#0e5490]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/brand/rcp-logo-white.png")}
          alt="Rubens Capital Partners"
          width={371}
          height={120}
          className="h-9 w-auto sm:h-10"
        />
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
