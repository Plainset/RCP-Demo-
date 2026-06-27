"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { login, demoCredentials, getSession } from "@/lib/auth";

const LOGIN_IMG =
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=80";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already signed in? Go straight to the portal.
  useEffect(() => {
    if (getSession()) router.replace("/portal");
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    login(email);
    router.push("/portal");
  }

  function useDemo() {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    setError("");
  }

  const field =
    "w-full rounded-sm border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-gold-500";

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `url(${LOGIN_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/50" />
        <div className="relative flex h-full flex-col justify-between p-12 text-cream-50">
          <Logo variant="light" />
          <div>
            <span className="eyebrow">Investor portal</span>
            <h1 className="mt-5 max-w-md font-display text-4xl leading-tight text-balance">
              Your portfolio, with total transparency.
            </h1>
            <p className="mt-4 max-w-sm text-cream-200/70">
              A secure, real-time view of your commitments, capital activity,
              performance and reporting across every Rubens Capital fund.
            </p>
          </div>
          <p className="text-xs text-cream-200/40">
            For institutional investors and family offices only.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-cream-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo variant="dark" />
          </div>

          <div className="mt-10 lg:mt-0">
            <span className="eyebrow">Institutional access</span>
            <h2 className="mt-4 font-display text-3xl text-ink-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-ink-600">
              Access your investor dashboard and reporting.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-900/[0.04] px-3 py-1.5 text-[0.7rem] font-medium text-ink-600">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              Secure access · 256-bit TLS encryption
            </div>
          </div>

          {/* Demo hint */}
          <div className="mt-7 rounded-sm border border-gold-500/30 bg-gold-500/[0.07] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-gold-700">
                Demo access
              </span>
              <button
                onClick={useDemo}
                className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-700 underline decoration-gold-500/50 underline-offset-2 hover:text-ink-900"
              >
                Use demo login
              </button>
            </div>
            <div className="mt-2 space-y-0.5 text-xs text-ink-700">
              <div>
                <span className="text-ink-500">Email:</span> {demoCredentials.email}
              </div>
              <div>
                <span className="text-ink-500">Password:</span> {demoCredentials.password}
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-600">
                Email
              </label>
              <input
                className={field}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.com"
                autoComplete="username"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600">
                  Password
                </label>
                <span className="text-[0.7rem] text-ink-500 hover:text-gold-700">
                  Forgot password?
                </span>
              </div>
              <input
                className={field}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && <p className="text-sm text-negative">{error}</p>}

            <button type="submit" disabled={submitting} className="btn btn-gold w-full">
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-500">
            Not yet an investor?{" "}
            <Link href="/contact" className="font-semibold text-gold-700 hover:text-gold-600">
              Get in touch
            </Link>
          </p>
          <p className="mt-8 text-center text-[0.7rem] leading-relaxed text-ink-400">
            Demo environment. Any credentials are accepted and all figures shown
            are illustrative sample data.
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[0.72rem] font-medium uppercase tracking-wider text-ink-500 hover:text-ink-800"
            >
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
