"use client";

/* ------------------------------------------------------------------ *
 *  Mock client-side auth for the demo investor portal.
 *  No backend — a session flag is kept in localStorage so the portal
 *  works fully on static hosting (GitHub Pages). Any non-empty
 *  credentials are accepted; the panel also shows demo credentials.
 * ------------------------------------------------------------------ */
import { useEffect, useState } from "react";

const KEY = "rcp.session";

export const demoCredentials = {
  email: "investor@meridian-pension.com",
  password: "demo1234",
};

export type Session = { email: string; loggedInAt: number };

export function login(email: string): void {
  const session: Session = { email, loggedInAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(session));
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
