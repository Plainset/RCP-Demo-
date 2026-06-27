import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Content-Security-Policy for a static GitHub Pages deploy.
// Notes:
// - script-src/style-src MUST keep 'unsafe-inline': the static export emits inline
//   hydration <script> blocks and React inline style attributes, and no per-request
//   nonce is possible without a server.
// - img-src allows the Unsplash CDN (hero/section imagery); frame-src allows the
//   Google Maps embed on /contact (bare www.google.com origin).
// - frame-ancestors / X-Frame-Options / HSTS are intentionally omitted: they are
//   ignored when delivered via <meta> and cannot be set as headers on GitHub Pages.
//   See README "Security notes" for how a CDN (e.g. Cloudflare) would add them.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://images.unsplash.com",
  "font-src 'self'",
  "frame-src https://www.google.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
].join("; ");

export const metadata: Metadata = {
  title: {
    default: "Rubens Capital Partners — Real Estate Asset & Investment Management",
    template: "%s · Rubens Capital Partners",
  },
  description:
    "An independent real estate asset and investment management platform with €4.0bn AUM across the Netherlands and the United States, investing for institutional investors and family offices.",
  referrer: "strict-origin-when-cross-origin",
  openGraph: {
    title: "Rubens Capital Partners",
    description:
      "An independent real estate asset & investment management platform. €4.0bn AUM across the Netherlands and the United States.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        {/* CSP must be the first head child so it applies as early as possible. */}
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
      </head>
      <body>{children}</body>
    </html>
  );
}
