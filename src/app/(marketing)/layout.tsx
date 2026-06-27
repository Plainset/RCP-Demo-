import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-sm focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-cream-50 focus:ring-2 focus:ring-gold-400"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <Footer />
    </>
  );
}
