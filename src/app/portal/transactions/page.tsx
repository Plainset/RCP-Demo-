"use client";

import { useMemo, useState } from "react";
import { PortalPageTop, Badge } from "@/components/portal-ui";
import { transactions, eur, shortDate } from "@/lib/portal";

type Filter = "All" | "Capital Call" | "Distribution";
const filters: Filter[] = ["All", "Capital Call", "Distribution"];

export default function TransactionsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const totals = useMemo(() => {
    const calls = transactions.filter((t) => t.type === "Capital Call").reduce((a, t) => a + t.amount, 0);
    const dist = transactions.filter((t) => t.type === "Distribution").reduce((a, t) => a + t.amount, 0);
    return { calls, dist };
  }, []);

  const rows = useMemo(
    () => (filter === "All" ? transactions : transactions.filter((t) => t.type === filter)),
    [filter]
  );

  return (
    <>
      <PortalPageTop
        title="Capital activity"
        subtitle="Capital calls and distributions across your funds."
      />

      <div className="space-y-6 px-6 py-8 md:px-10">
        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-sm border border-ink-900/10 bg-white p-5">
            <div className="text-[0.68rem] font-semibold uppercase tracking-wider text-ink-500">
              Distributions received
            </div>
            <div className="mt-2 font-display text-2xl text-positive">+{eur(totals.dist, { compact: true })}</div>
            <div className="mt-1 text-xs text-ink-500">Trailing period</div>
          </div>
          <div className="rounded-sm border border-ink-900/10 bg-white p-5">
            <div className="text-[0.68rem] font-semibold uppercase tracking-wider text-ink-500">
              Capital called
            </div>
            <div className="mt-2 font-display text-2xl text-ink-900">{eur(totals.calls, { compact: true })}</div>
            <div className="mt-1 text-xs text-ink-500">Trailing period</div>
          </div>
          <div className="rounded-sm border border-ink-900/10 bg-white p-5">
            <div className="text-[0.68rem] font-semibold uppercase tracking-wider text-ink-500">
              Net cash flow
            </div>
            <div className="mt-2 font-display text-2xl text-ink-900">
              +{eur(totals.dist - totals.calls, { compact: true })}
            </div>
            <div className="mt-1 text-xs text-ink-500">Distributions less calls</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === f
                  ? "bg-ink-950 text-cream-50"
                  : "border border-ink-900/12 text-ink-600 hover:border-gold-500/50 hover:text-ink-900"
              }`}
            >
              {f === "All" ? "All activity" : `${f}s`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-sm border border-ink-900/10 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 text-left">
                  {["Date", "Fund", "Type", "Detail", "Amount", "Status"].map((c, i) => (
                    <th
                      key={c}
                      className={`px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-wider text-ink-500 ${
                        i === 4 ? "text-right" : ""
                      }`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/6">
                {rows.map((t) => {
                  const isDist = t.type === "Distribution";
                  return (
                    <tr key={t.id} className="transition-colors hover:bg-cream-50">
                      <td className="whitespace-nowrap px-5 py-4 text-ink-700">{shortDate(t.date)}</td>
                      <td className="px-5 py-4 text-ink-800">{t.fund}</td>
                      <td className="px-5 py-4">
                        <Badge tone={isDist ? "positive" : "neutral"}>{t.type}</Badge>
                      </td>
                      <td className="px-5 py-4 text-ink-600">{t.detail}</td>
                      <td className={`whitespace-nowrap px-5 py-4 text-right font-medium ${isDist ? "text-positive" : "text-ink-900"}`}>
                        {isDist ? "+" : "−"}
                        {eur(t.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <Badge tone={t.status === "Pending" ? "warn" : "neutral"}>{t.status}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-ink-500">
          Distributions are shown as inflows to the investor; capital calls as
          outflows. Illustrative sample data.
        </p>
      </div>
    </>
  );
}
