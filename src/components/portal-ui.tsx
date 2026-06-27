import { investor } from "@/lib/portal";

/** Page header used across portal pages. */
export function PortalPageTop({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-ink-900/10 bg-cream-50 px-6 py-7 md:flex-row md:items-end md:justify-between md:px-10">
      <div>
        <h1 className="font-display text-2xl text-ink-900 md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-600">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {children}
        <div className="text-right">
          <div className="text-[0.65rem] uppercase tracking-wider text-ink-500">As of</div>
          <div className="text-sm font-medium text-ink-800">{investor.asOf}</div>
        </div>
      </div>
    </div>
  );
}

/** KPI / stat card. */
export function Kpi({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-sm border p-5 ${
        accent
          ? "border-transparent bg-ink-950 text-cream-50"
          : "border-ink-900/10 bg-white"
      }`}
    >
      <div
        className={`text-[0.68rem] font-semibold uppercase tracking-wider ${
          accent ? "text-cream-200/55" : "text-ink-500"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-2 font-display text-2xl md:text-[1.7rem] ${
          accent ? "text-cream-50" : "text-ink-900"
        }`}
      >
        {value}
      </div>
      {sub && (
        <div className={`mt-1.5 text-xs ${accent ? "text-gold-300" : "text-ink-600"}`}>{sub}</div>
      )}
    </div>
  );
}

/** Small status badge. */
export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "positive" | "warn" | "gold";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink-900/8 text-ink-600",
    positive: "bg-positive/12 text-positive",
    warn: "bg-negative/12 text-negative",
    gold: "bg-gold-500/15 text-gold-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Section card wrapper for portal panels. */
export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-sm border border-ink-900/10 bg-white ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between border-b border-ink-900/8 px-5 py-4">
          {title && <h2 className="font-display text-lg text-ink-900">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
