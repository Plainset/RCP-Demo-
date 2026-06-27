"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { navLinks } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-ink-900/10 bg-cream-50/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="shell flex h-20 items-center justify-between">
        <Logo variant="dark" />

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-[0.82rem] font-medium tracking-wide transition-colors duration-300 ${
                isActive(l.href) ? "text-ink-900" : "text-ink-600 hover:text-ink-900"
              }`}
            >
              {l.label}
              <span
                className={`absolute -bottom-1.5 left-0 h-px bg-gold-500 transition-all duration-300 ${
                  isActive(l.href) ? "w-full" : "w-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link href="/login" className="btn btn-ink text-[0.72rem]">
            Investor Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-10 w-10 items-center justify-center lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-ink-900 transition-all duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-6 bg-ink-900 transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-ink-900 transition-all duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile panel */}
      <div
        className={`overflow-hidden border-t border-ink-900/10 bg-cream-50 lg:hidden ${
          open ? "max-h-[28rem]" : "max-h-0"
        } transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
      >
        <nav className="shell flex flex-col gap-1 py-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`border-b border-ink-900/5 py-3 font-display text-xl ${
                isActive(l.href) ? "text-gold-700" : "text-ink-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="btn btn-gold mt-4 w-full">
            Investor Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
