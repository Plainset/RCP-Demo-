import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-ink-950 px-6 text-cream-50">
      <div className="text-center">
        <Logo variant="light" href="/" />
        <div className="mt-12 font-display text-7xl text-gold-400">404</div>
        <h1 className="mt-4 font-display text-2xl">This page could not be found.</h1>
        <p className="mt-3 text-cream-200/60">
          The page you're looking for may have moved or no longer exists.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-gold">
            Return home
          </Link>
          <Link href="/login" className="btn btn-ghost-light">
            Investor login
          </Link>
        </div>
      </div>
    </main>
  );
}
