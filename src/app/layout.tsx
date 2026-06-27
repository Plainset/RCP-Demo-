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

export const metadata: Metadata = {
  title: {
    default: "Rubens Capital Partners — Real Estate Asset & Investment Management",
    template: "%s · Rubens Capital Partners",
  },
  description:
    "An independent real estate asset and investment management platform with €4.0bn AUM across the Netherlands and the United States, investing for institutional investors and family offices.",
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
      <body>{children}</body>
    </html>
  );
}
