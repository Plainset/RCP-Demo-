/* ------------------------------------------------------------------ *
 *  Investor portal — seeded demo data
 *  All figures are illustrative and internally consistent.
 *  Currency is reported in EUR (€), the investor's reporting currency.
 * ------------------------------------------------------------------ */

export const investor = {
  entity: "Meridian Institutional Pension Fund",
  accountId: "RCP-INST-04127",
  contact: "K. Leijnse — Investor Relations",
  relationshipManager: "Karin Leijnse",
  reportingCurrency: "EUR",
  asOf: "30 June 2026",
  memberSince: 2018,
};

export type Holding = {
  id: string;
  fund: string;
  strategy: string;
  vintage: number;
  commitment: number; // € total commitment
  contributed: number; // paid-in capital
  distributed: number; // capital returned
  nav: number; // current net asset value
  ownershipPct: number;
  netIrr: number; // %
  moic: number; // x
  color: string;
};

/** Per-fund positions. Aggregates below are derived from these. */
export const holdings: Holding[] = [
  {
    id: "drf4",
    fund: "RCP Dutch Residential Fund IV",
    strategy: "Dutch Residential",
    vintage: 2019,
    commitment: 50_000_000,
    contributed: 46_000_000,
    distributed: 12_400_000,
    nav: 58_200_000,
    ownershipPct: 4.2,
    netIrr: 11.8,
    moic: 1.53,
    color: "#1b3a59",
  },
  {
    id: "usmf2",
    fund: "RCP US Multifamily Partners II",
    strategy: "US Multifamily",
    vintage: 2020,
    commitment: 30_000_000,
    contributed: 25_500_000,
    distributed: 6_100_000,
    nav: 31_800_000,
    ownershipPct: 6.8,
    netIrr: 14.2,
    moic: 1.49,
    color: "#c4a368",
  },
  {
    id: "doif",
    fund: "RCP Dutch Office Income Fund",
    strategy: "Dutch Offices",
    vintage: 2018,
    commitment: 25_000_000,
    contributed: 23_000_000,
    distributed: 5_800_000,
    nav: 22_100_000,
    ownershipPct: 3.1,
    netIrr: 6.4,
    moic: 1.21,
    color: "#2a4d70",
  },
  {
    id: "schf1",
    fund: "RCP Senior & Care Housing Fund I",
    strategy: "Senior & Care Housing",
    vintage: 2021,
    commitment: 15_000_000,
    contributed: 11_200_000,
    distributed: 1_400_000,
    nav: 13_600_000,
    ownershipPct: 9.5,
    netIrr: 9.1,
    moic: 1.34,
    color: "#a8884f",
  },
];

function sum(key: keyof Holding): number {
  return holdings.reduce((acc, h) => acc + (h[key] as number), 0);
}

const totalContributed = sum("contributed");
const totalDistributed = sum("distributed");
const totalNav = sum("nav");
const totalCommitment = sum("commitment");

/** Portfolio-level KPIs shown on the dashboard. */
export const portfolio = {
  commitment: totalCommitment,
  contributed: totalContributed,
  distributed: totalDistributed,
  nav: totalNav,
  unfunded: totalCommitment - totalContributed,
  totalValue: totalNav + totalDistributed,
  // Multiples
  dpi: totalDistributed / totalContributed, // distributions / paid-in
  tvpi: (totalNav + totalDistributed) / totalContributed, // total value / paid-in
  netIrr: 11.4, // blended net IRR (%)
};

/** Quarterly NAV history (€m) for the performance chart. */
export type NavPoint = { label: string; nav: number; contributed: number; distributed: number };

export const navHistory: NavPoint[] = [
  { label: "Q1 21", nav: 64.2, contributed: 72.0, distributed: 4.1 },
  { label: "Q3 21", nav: 71.5, contributed: 80.5, distributed: 6.8 },
  { label: "Q1 22", nav: 83.4, contributed: 88.0, distributed: 9.5 },
  { label: "Q3 22", nav: 92.1, contributed: 93.4, distributed: 12.2 },
  { label: "Q1 23", nav: 98.7, contributed: 97.0, distributed: 15.0 },
  { label: "Q3 23", nav: 104.2, contributed: 100.2, distributed: 17.6 },
  { label: "Q1 24", nav: 109.9, contributed: 102.4, distributed: 19.8 },
  { label: "Q3 24", nav: 114.6, contributed: 103.5, distributed: 21.4 },
  { label: "Q1 25", nav: 119.1, contributed: 104.6, distributed: 23.0 },
  { label: "Q3 25", nav: 122.4, contributed: 105.2, distributed: 24.3 },
  { label: "Q1 26", nav: 124.5, contributed: 105.7, distributed: 25.1 },
  { label: "Q2 26", nav: 125.7, contributed: 105.7, distributed: 25.7 },
];

/* ------------------------------------------------------------------ *
 *  Transactions — capital calls & distributions
 * ------------------------------------------------------------------ */
export type Txn = {
  id: string;
  date: string;
  fund: string;
  type: "Capital Call" | "Distribution";
  detail: string;
  amount: number; // positive = call (outflow from investor), distributions shown as positive inflow
  status: "Settled" | "Pending";
};

export const transactions: Txn[] = [
  { id: "t12", date: "2026-06-12", fund: "RCP Dutch Residential Fund IV", type: "Distribution", detail: "Q2 2026 income distribution", amount: 1_180_000, status: "Settled" },
  { id: "t11", date: "2026-05-28", fund: "RCP Senior & Care Housing Fund I", type: "Capital Call", detail: "Call no. 6 — asset acquisition", amount: 900_000, status: "Pending" },
  { id: "t10", date: "2026-04-09", fund: "RCP US Multifamily Partners II", type: "Distribution", detail: "Refinancing proceeds", amount: 1_640_000, status: "Settled" },
  { id: "t09", date: "2026-03-15", fund: "RCP Dutch Office Income Fund", type: "Distribution", detail: "Q1 2026 income distribution", amount: 410_000, status: "Settled" },
  { id: "t08", date: "2026-02-20", fund: "RCP Dutch Residential Fund IV", type: "Capital Call", detail: "Call no. 9 — capex programme", amount: 1_250_000, status: "Settled" },
  { id: "t07", date: "2025-12-18", fund: "RCP US Multifamily Partners II", type: "Distribution", detail: "Q4 2025 income distribution", amount: 720_000, status: "Settled" },
  { id: "t06", date: "2025-11-30", fund: "RCP Senior & Care Housing Fund I", type: "Capital Call", detail: "Call no. 5 — development funding", amount: 1_050_000, status: "Settled" },
  { id: "t05", date: "2025-09-22", fund: "RCP Dutch Residential Fund IV", type: "Distribution", detail: "Q3 2025 income distribution", amount: 1_090_000, status: "Settled" },
  { id: "t04", date: "2025-08-14", fund: "RCP Dutch Office Income Fund", type: "Capital Call", detail: "Call no. 7 — ESG retrofit", amount: 680_000, status: "Settled" },
  { id: "t03", date: "2025-06-11", fund: "RCP US Multifamily Partners II", type: "Distribution", detail: "Partial asset disposal", amount: 1_320_000, status: "Settled" },
  { id: "t02", date: "2025-05-03", fund: "RCP Dutch Residential Fund IV", type: "Distribution", detail: "Q2 2025 income distribution", amount: 1_010_000, status: "Settled" },
  { id: "t01", date: "2025-03-19", fund: "RCP Senior & Care Housing Fund I", type: "Capital Call", detail: "Call no. 4 — asset acquisition", amount: 820_000, status: "Settled" },
];

/* ------------------------------------------------------------------ *
 *  Document vault
 * ------------------------------------------------------------------ */
export type Doc = {
  id: string;
  title: string;
  fund: string;
  category: "Quarterly Report" | "Capital Account" | "Capital Call Notice" | "Tax" | "Legal";
  date: string;
  size: string;
};

export const documents: Doc[] = [
  { id: "d1", title: "Q2 2026 Quarterly Report", fund: "All funds", category: "Quarterly Report", date: "2026-06-20", size: "3.4 MB" },
  { id: "d2", title: "Q2 2026 Capital Account Statement", fund: "Consolidated", category: "Capital Account", date: "2026-06-20", size: "612 KB" },
  { id: "d3", title: "Capital Call Notice no. 6", fund: "RCP Senior & Care Housing Fund I", category: "Capital Call Notice", date: "2026-05-28", size: "248 KB" },
  { id: "d4", title: "Q1 2026 Quarterly Report", fund: "All funds", category: "Quarterly Report", date: "2026-03-22", size: "3.2 MB" },
  { id: "d5", title: "2025 Annual Report & Audited Accounts", fund: "All funds", category: "Quarterly Report", date: "2026-03-01", size: "8.1 MB" },
  { id: "d6", title: "Capital Call Notice no. 9", fund: "RCP Dutch Residential Fund IV", category: "Capital Call Notice", date: "2026-02-20", size: "240 KB" },
  { id: "d7", title: "2025 Tax Reporting Pack", fund: "Consolidated", category: "Tax", date: "2026-02-10", size: "1.1 MB" },
  { id: "d8", title: "Q4 2025 Quarterly Report", fund: "All funds", category: "Quarterly Report", date: "2025-12-19", size: "3.0 MB" },
  { id: "d9", title: "Limited Partnership Agreement (amended)", fund: "RCP US Multifamily Partners II", category: "Legal", date: "2025-10-04", size: "2.2 MB" },
  { id: "d10", title: "Q3 2025 Capital Account Statement", fund: "Consolidated", category: "Capital Account", date: "2025-09-23", size: "598 KB" },
];

/* ------------------------------------------------------------------ *
 *  Formatting helpers
 * ------------------------------------------------------------------ */
export function eur(n: number, opts?: { compact?: boolean; decimals?: number }): string {
  if (opts?.compact) {
    if (Math.abs(n) >= 1_000_000) return `€${(n / 1_000_000).toFixed(opts.decimals ?? 1)}m`;
    if (Math.abs(n) >= 1_000) return `€${(n / 1_000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: opts?.decimals ?? 0,
  }).format(n);
}

export function pct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

export function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}
