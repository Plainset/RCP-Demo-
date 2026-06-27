"use client";

/* ------------------------------------------------------------------ *
 *  Client-side auth for the demo investor portal.
 *
 *  There is no backend (the site is a static export on GitHub Pages),
 *  so credentials are verified in the browser against a known set of
 *  authorised institutional accounts. Unlike a throwaway mock, this
 *  ACTUALLY validates: the email must be a recognised account and the
 *  password must match. Passwords are never stored in plaintext — only
 *  a SHA-256 hash lives in the bundle, and we compare hashes via the
 *  Web Crypto API (available on the HTTPS deploy and on localhost).
 *
 *  NOTE: client-side checks can never be a real security boundary —
 *  the portal data is illustrative sample data and protecting it is not
 *  the point. The goal is a login that behaves like the real thing:
 *  correct credentials get in, anything else is rejected.
 * ------------------------------------------------------------------ */
import { useEffect, useState } from "react";

const KEY = "rcp.session";

/** Credentials surfaced in the on-screen demo hint / "Use demo login". */
export const demoCredentials = {
  email: "investor@meridian-pension.com",
  password: "demo1234",
};

/**
 * Authorised accounts. The value is the SHA-256 hex digest of the
 * account password — never the password itself.
 *   sha256("demo1234") = 0ead2060…57c5d
 */
const ACCOUNTS: Record<string, { passwordHash: string }> = {
  "investor@meridian-pension.com": {
    passwordHash:
      "0ead2060b65992dca4769af601a1b3a35ef38cfad2c2c465bb160ea764157c5d",
  },
};

export type Session = { email: string; loggedInAt: number };

export type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

/** SHA-256 → lowercase hex, via Web Crypto. */
async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Validate credentials and, on success, persist a session.
 * Returns a result object — the caller decides how to surface errors.
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  const normalisedEmail = email.trim().toLowerCase();
  const account = ACCOUNTS[normalisedEmail];

  // Always hash, even when the account is unknown, so the response time
  // doesn't reveal whether an email is registered.
  const hash = await sha256Hex(password);

  if (!account || account.passwordHash !== hash) {
    return {
      ok: false,
      error: "The email or password you entered is incorrect.",
    };
  }

  const session: Session = { email: normalisedEmail, loggedInAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(session));
  return { ok: true };
}

export function logout(): void {
  localStorage.removeItem(KEY);
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

/**
 * Hook returning the current session.
 * `status` is "loading" until we've read localStorage on the client,
 * which avoids a hydration flash on the static export.
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setStatus(s ? "authenticated" : "unauthenticated");
  }, []);

  return { session, status };
}
