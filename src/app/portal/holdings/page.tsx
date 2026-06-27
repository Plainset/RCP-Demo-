import { PortalPageTop, Panel, Badge } from "@/components/portal-ui";
import { holdings, portfolio, eur, pct } from "@/lib/portal";

const cols = ["Fund", "Vintage", "Commitment", "Contributed", "Distributed", "NAV", "Net IRR", "MOIC"];

export default function HoldingsPage() {
  return (
    <>
      <PortalPageTop title="Holdings" subtitle="Your positions across all Rubens Capital funds." />

      <div className="space-y-6 px-6 py-8 md:px-10">
        {/* Per-fund cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {holdings.map((h) => {
            const calledPct = (h.contributed / h.commitment) * 100;
            return (
              <div key={h.id} className="rounded-sm border border-ink-900/10 bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: h.color }} />
                      <h3 className="font-display text-lg leading-tight text-ink-900">{h.fund}</h3>
                    </div>
                    <div className="mt-1 text-xs text-ink-500">
                      {h.strategy} · Vintage {h.vintage} · {pct(h.ownershipPct)} ownership
                    </div>
                  </div>
                  <Badge tone="positive">{pct(h.netIrr)} IRR</Badge>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-4">
                  {[
                    ["NAV", eur(h.nav, { compact: true })],
                    ["Distributed", eur(h.distributed, { compact: true })],
                    ["MOIC", `${h.moic.toFixed(2)}×`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="font-display text-xl text-ink-900">{v}</div>
                      <div className="text-[0.65rem] uppercase tracking-wider text-ink-500">{k}</div>
                    </div>
                  ))}
                </div>

                {/* Called progress */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs text-ink-600">
                    <span>Capital called</span>
                    <span className="font-medium text-ink-800">
                      {eur(h.contributed, { compact: true })} / {eur(h.commitment, { compact: true })}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-900/8">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${calledPct}%`, backgroundColor: h.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed table */}
        <Panel title="Detail">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 text-left">
                  {cols.map((c, i) => (
                    <th
                      key={c}
                      className={`px-5 py-3 text-[0.68rem] font-semibold uppercase tracking-wider text-ink-500 ${
                        i === 0 ? "" : "text-right"
                      }`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/6">
                {holdings.map((h) => (
                  <tr key={h.id} className="transition-colors hover:bg-cream-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: h.color }} />
                        <div>
                          <div className="font-medium text-ink-900">{h.fund}</div>
                          <div className="text-xs text-ink-500">{h.strategy}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-ink-700">{h.vintage}</td>
                    <td className="px-5 py-4 text-right text-ink-700">{eur(h.commitment, { compact: true })}</td>
                    <td className="px-5 py-4 text-right text-ink-700">{eur(h.contributed, { compact: true })}</td>
                    <td className="px-5 py-4 text-right text-ink-700">{eur(h.distributed, { compact: true })}</td>
                    <td className="px-5 py-4 text-right font-medium text-ink-900">{eur(h.nav, { compact: true })}</td>
                    <td className="px-5 py-4 text-right font-medium text-positive">{pct(h.netIrr)}</td>
                    <td className="px-5 py-4 text-right text-ink-900">{h.moic.toFixed(2)}×</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink-900/15 bg-cream-50 font-medium">
                  <td className="px-5 py-4 font-display text-ink-900">Total portfolio</td>
                  <td className="px-5 py-4" />
                  <td className="px-5 py-4 text-right text-ink-900">{eur(portfolio.commitment, { compact: true })}</td>
                  <td className="px-5 py-4 text-right text-ink-900">{eur(portfolio.contributed, { compact: true })}</td>
                  <td className="px-5 py-4 text-right text-ink-900">{eur(portfolio.distributed, { compact: true })}</td>
                  <td className="px-5 py-4 text-right text-ink-900">{eur(portfolio.nav, { compact: true })}</td>
                  <td className="px-5 py-4 text-right text-positive">{pct(portfolio.netIrr)}</td>
                  <td className="px-5 py-4 text-right text-ink-900">{portfolio.tvpi.toFixed(2)}×</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Panel>

        <p className="text-xs leading-relaxed text-ink-500">
          MOIC and Net IRR are net of fees and expenses. TVPI shown on the total
          line. All figures are illustrative sample data presented for this demo.
        </p>
      </div>
    </>
  );
}
