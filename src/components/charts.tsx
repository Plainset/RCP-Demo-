/* ------------------------------------------------------------------ *
 *  Lightweight, dependency-free SVG charts for the investor portal.
 *  Pure presentational components — safe to render on the server.
 * ------------------------------------------------------------------ */

/* ----------------------------------------------------- Donut chart */
export function DonutChart({
  data,
  size = 196,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((a, d) => a + d.value, 0);
  const radius = (size - thickness) / 2;
  const circ = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(8,22,38,0.06)"
          strokeWidth={thickness}
        />
        {data.map((d) => {
          const len = total ? (d.value / total) * circ : 0;
          const seg = (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return seg;
        })}
      </svg>
      {(centerValue || centerLabel) && (
        <div className="absolute text-center">
          {centerValue && (
            <div className="font-display text-2xl text-ink-900">{centerValue}</div>
          )}
          {centerLabel && (
            <div className="mt-0.5 text-[0.62rem] uppercase tracking-wider text-ink-500">
              {centerLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------ Area / line chart */
export function AreaChart({
  points,
  height = 260,
  valueFormat = (n) => `${n}`,
}: {
  points: { label: string; value: number }[];
  height?: number;
  valueFormat?: (n: number) => string;
}) {
  const W = 760;
  const H = height;
  const padL = 44;
  const padR = 16;
  const padT = 18;
  const padB = 30;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  // Pad the domain a little for headroom.
  const lo = Math.floor((min - (max - min) * 0.15) / 10) * 10;
  const hi = Math.ceil((max + (max - min) * 0.12) / 10) * 10;

  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const x = (i: number) => padL + (i / (points.length - 1)) * innerW;
  const y = (v: number) => padT + innerH - ((v - lo) / (hi - lo)) * innerH;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${x(points.length - 1).toFixed(1)} ${padT + innerH} L ${x(0).toFixed(
    1
  )} ${padT + innerH} Z`;

  // Horizontal gridlines (4 bands)
  const ticks = 4;
  const gridVals = Array.from({ length: ticks + 1 }, (_, i) => lo + ((hi - lo) * i) / ticks);

  // Show roughly 6 x-axis labels to avoid crowding.
  const labelEvery = Math.ceil(points.length / 6);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Net asset value over time"
    >
      <defs>
        <linearGradient id="navFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4a368" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#c4a368" stopOpacity="0" />
        </linearGradient>
      </defs>

      {gridVals.map((v) => (
        <g key={v}>
          <line
            x1={padL}
            x2={W - padR}
            y1={y(v)}
            y2={y(v)}
            stroke="rgba(8,22,38,0.07)"
            strokeWidth={1}
          />
          <text x={padL - 10} y={y(v) + 3} textAnchor="end" className="fill-ink-400" fontSize="10">
            {valueFormat(Math.round(v))}
          </text>
        </g>
      ))}

      <path d={areaPath} fill="url(#navFill)" />
      <path d={linePath} fill="none" stroke="#a8884f" strokeWidth={2.2} strokeLinejoin="round" />

      {points.map((p, i) => (
        <g key={p.label}>
          {i % labelEvery === 0 && (
            <text x={x(i)} y={H - 10} textAnchor="middle" className="fill-ink-400" fontSize="10">
              {p.label}
            </text>
          )}
          {i === points.length - 1 && (
            <circle cx={x(i)} cy={y(p.value)} r={3.5} fill="#a8884f" stroke="#fff" strokeWidth={1.5} />
          )}
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------- Mini bar (sparkline-ish) */
export function MiniBars({ data, color = "#c4a368" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-10 items-end gap-1">
      {data.map((d, i) => (
        <div
          key={i}
          className="w-full rounded-[1px]"
          style={{ height: `${(d / max) * 100}%`, backgroundColor: color, opacity: 0.35 + (i / data.length) * 0.65 }}
        />
      ))}
    </div>
  );
}
