"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { useSession, logout } from "@/lib/auth";
import { investor } from "@/lib/portal";
import { initials } from "@/lib/site";

type IconProps = { className?: string };
const Icon = {
  dashboard: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className} stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  holdings: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className} stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" /><path d="m2 16 10 5 10-5" /><path d="m2 12 10 5 10-5" />
    </svg>
  ),
  activity: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className} stroke="currentColor" strokeWidth="1.7">
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </svg>
  ),
  documents: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" className={p.className} stroke="currentColor" strokeWidth="1.7">
      <path d="M14 3v5h5" /><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5Z" />
    </svg>
  ),
};

const nav = [
  { label: "Dashboard", href: "/portal", icon: Icon.dashboard },
  { label: "Holdings", href: "/portal/holdings", icon: Icon.holdings },
  { label: "Capital Activity", href: "/portal/transactions", icon: Icon.activity },
  { label: "Documents", href: "/portal/documents", icon: Icon.documents },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-gold-500" />
          <span className="text-xs uppercase tracking-widest text-ink-500">Loading portal…</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") router.replace("/login");
    return (
      <div className="grid min-h-screen place-items-center bg-cream-50">
        <span className="text-xs uppercase tracking-widest text-ink-500">Redirecting to sign in…</span>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/portal" ? pathname === "/portal" || pathname === "/portal/" : pathname.startsWith(href);

  function onLogout() {
    logout();
    router.replace("/login");
  }

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition-colors ${
              active
                ? "bg-gold-500/15 text-gold-300"
                : "text-cream-200/65 hover:bg-cream-100/5 hover:text-cream-50"
            }`}
          >
            <item.icon className={`h-[1.15rem] w-[1.15rem] ${active ? "text-gold-400" : ""}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream-100 lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen flex-col bg-ink-950 p-6 lg:flex">
        <Logo variant="light" href="/portal" />
        <div className="mt-10 px-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cream-200/35">
          Investor Portal
        </div>
        <div className="mt-3">
          <NavLinks />
        </div>

        <div className="mt-auto">
          <Link
            href="/"
            className="mb-4 flex items-center gap-2 px-4 text-xs text-cream-200/45 transition-colors hover:text-gold-300"
          >
            ← Public website
          </Link>
          <div className="rounded-sm border border-cream-100/10 bg-ink-900 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-sm bg-gold-500/15 font-display text-sm text-gold-400">
                {initials(investor.entity)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-cream-50">{investor.entity}</div>
                <div className="truncate text-[0.7rem] text-cream-200/45">{investor.accountId}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="mt-4 w-full rounded-sm border border-cream-100/15 py-2 text-xs font-semibold uppercase tracking-wider text-cream-200/70 transition-colors hover:border-gold-500/50 hover:text-gold-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-ink-950 px-5 py-4 lg:hidden">
        <Logo variant="light" href="/portal" />
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-9 w-9 place-items-center rounded-sm border border-cream-100/15 text-cream-50"
        >
          <span className="text-lg leading-none">{mobileOpen ? "✕" : "☰"}</span>
        </button>
      </div>
      {mobileOpen && (
        <div className="sticky top-[3.75rem] z-30 border-b border-cream-100/10 bg-ink-950 p-5 lg:hidden">
          <NavLinks onNavigate={() => setMobileOpen(false)} />
          <div className="mt-4 flex items-center justify-between border-t border-cream-100/10 pt-4">
            <Link href="/" className="text-xs text-cream-200/50">← Public website</Link>
            <button
              onClick={onLogout}
              className="text-xs font-semibold uppercase tracking-wider text-gold-300"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
