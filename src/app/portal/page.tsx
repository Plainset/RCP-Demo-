import Link from "next/link";
import { PortalPageTop, Kpi, Badge, Panel } from "@/components/portal-ui";
import { AreaChart, DonutChart } from "@/components/charts";
import {
  investor,
  portfolio,
  holdings,
  navHistory,
  transactions,
  eur,
  pct,
  shortDate,
} from "@/lib/portal";

export default function DashboardPage() {
  const allocation = holdings.map((h) => ({
    label: h.strategy,
    value: h.nav,
    color: h.color,
  }));
  const navSeries = navHistory.map((p) => ({ label: p.label, value: p.nav }));
  const recent = transactions.slice(0, 5);
  const pendingCall = transactions.find((t) => t.status === "Pending");

  return (
    <>
      <PortalPageTop
        title="Portfolio overview"
        subtitle={`Welcome back — ${investor.entity}`}
      />

      <div className="space-y-6 px-6 py-8 md:px-10">
        {/* Pending capital call alert */}
        {pendingCall && (
          <div className="flex flex-col gap-3 rounded-sm border border-gold-500/30 bg-gold-500/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-500/20 text-sm text-gold-700">
                !
              </span>
              <div className="text-sm text-ink-800">
                <span className="font-semibold">Capital call pending — </span>
                {pendingCall.detail} ({pendingCall.fund}) for{" "}
                <span className="font-semibold">{eur(pendingCall.amount)}</span>, due{" "}
                {shortDate(pendingCall.date)}.
              </div>
            </div>
            <Link href="/portal/transactions" className="btn btn-ink shrink-0 text-[0.68rem]">
              Review
            </Link>
          </div>
        )}

        {/* KPI row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            label="Portfolio value (NAV)"
            value={eur(portfolio.nav, { compact: true })}
            sub={<>▲ Net IRR {pct(portfolio.netIrr)} · TVPI {portfolio.tvpi.toFixed(2)}×</>}
            accent
          />
          <Kpi
            label="Total commitment"
            value={eur(portfolio.commitment, { compact: true })}
            sub={`${eur(portfolio.unfunded, { compact: true })} unfunded`}
          />
          <Kpi
            label="Capital contributed"
            value={eur(portfolio.contributed, { compact: true })}
            sub={`${pct((portfolio.contributed / portfolio.commitment) * 100, 0)} of commitment called`}
          />
          <Kpi
            label="Total distributed"
            value={eur(portfolio.distributed, { compact: true })}
            sub={`DPI ${portfolio.dpi.toFixed(2)}×`}
          />
        </div>

        {/* Chart + allocation */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel title="Net asset value" className="lg:col-span-2" action={<Badge tone="gold">€ millions</Badge>}>
            <div className="px-3 py-5 sm:px-5">
              <AreaChart points={navSeries} valueFormat={(n) => `${n}`} />
            </div>
          </Panel>

          <Panel title="Allocation by strategy">
            <div className="flex flex-col items-center gap-6 p-5">
              <DonutChart
                data={allocation}
                centerValue={eur(portfolio.nav, { compact: true })}
                centerLabel="Total NAV"
              />
              <ul className="w-full space-y-2.5">
                {allocation.map((a) => {
                  const share = (a.value / portfolio.nav) * 100;
                  return (
                    <li key={a.label} className="flex items-center gap-3 text-sm">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: a.color }}
                      />
                      <span className="flex-1 truncate text-ink-700">{a.label}</span>
                      <span className="font-medium text-ink-900">{pct(share, 0)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Panel>
        </div>

        {/* Funds + recent activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Panel
            title="Funds"
            className="lg:col-span-2"
            action={
              <Link
                href="/portal/holdings"
                className="text-xs font-semibold uppercase tracking-wider text-gold-700 hover:text-gold-600"
              >
                View all →
              </Link>
            }
          >
            <div className="divide-y divide-ink-900/8">
              {holdings.map((h) => (
                <div key={h.id} className="flex items-center gap-4 px-5 py-4">
                  <span className="h-9 w-1 shrink-0 rounded-full" style={{ backgroundColor: h.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-900">{h.fund}</div>
                    <div className="text-xs text-ink-500">
                      {h.strategy} · Vintage {h.vintage}
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="text-sm font-medium text-ink-900">{eur(h.nav, { compact: true })}</div>
                    <div className="text-[0.7rem] text-ink-500">NAV</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-positive">{pct(h.netIrr)}</div>
                    <div className="text-[0.7rem] text-ink-500">Net IRR</div>
                  </div>
                  <div className="hidden text-right md:block">
                    <div className="text-sm font-medium text-ink-900">{h.moic.toFixed(2)}×</div>
                    <div className="text-[0.7rem] text-ink-500">MOIC</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Recent activity"
            action={
              <Link
                href="/portal/transactions"
                className="text-xs font-semibold uppercase tracking-wider text-gold-700 hover:text-gold-600"
              >
                All →
              </Link>
            }
          >
            <ul className="divide-y divide-ink-900/8">
              {recent.map((t) => {
                const isDist = t.type === "Distribution";
                return (
                  <li key={t.id} className="flex items-start gap-3 px-5 py-3.5">
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs ${
                        isDist ? "bg-positive/12 text-positive" : "bg-ink-900/8 text-ink-600"
                      }`}
                    >
                      {isDist ? "↓" : "↑"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-ink-800">{t.type}</div>
                      <div className="truncate text-xs text-ink-500">{t.fund}</div>
                      <div className="mt-0.5 text-[0.7rem] text-ink-400">{shortDate(t.date)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${isDist ? "text-positive" : "text-ink-900"}`}>
                        {isDist ? "+" : ""}
                        {eur(t.amount, { compact: true })}
                      </div>
                      {t.status === "Pending" && <Badge tone="warn">Pending</Badge>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
