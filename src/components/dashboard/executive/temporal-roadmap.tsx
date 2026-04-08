import type { Initiative } from "@/types/initiative";
import type { Quarter } from "@/types/enums";
import { formatCurrencyBRL, formatNumber } from "@/lib/format";

type TemporalRoadmapProps = {
  items: Initiative[];
};

const quarters: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

const quarterColors: Record<Quarter, string> = {
  Q1: "bg-[color:var(--btg-color-info)]/10",
  Q2: "bg-[color:var(--btg-color-success)]/10",
  Q3: "bg-[color:var(--btg-color-warning)]/15",
  Q4: "bg-[color:var(--btg-color-primary)]/10",
};

const horizonBadge: Record<Initiative["horizon"], string> = {
  curto: "bg-[color:var(--btg-color-info)]/20",
  medio: "bg-[color:var(--btg-color-warning)]/25",
  longo: "bg-[color:var(--btg-color-primary)]/20",
};

export function TemporalRoadmap({ items }: TemporalRoadmapProps) {
  const horizonCount = items.reduce<Record<Initiative["horizon"], number>>(
    (acc, item) => {
      acc[item.horizon] += 1;
      return acc;
    },
    { curto: 0, medio: 0, longo: 0 },
  );
  const dominantHorizon = (["curto", "medio", "longo"] as Initiative["horizon"][])
    .sort((a, b) => horizonCount[b] - horizonCount[a])[0];

  const roadmapByQuarter = quarters.map((quarter) => {
    const quarterItems = items
      .filter((item) => item.quarter === quarter)
      .sort((a, b) => a.year - b.year);

    return {
      quarter,
      items: quarterItems,
      hours: quarterItems.reduce((acc, item) => acc + item.estimated_hours, 0),
      cost: quarterItems.reduce((acc, item) => acc + item.total_cost, 0),
    };
  });

  return (
    <section className="rounded-2xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
      <header className="mb-4 space-y-1">
        <h2 className="text-2xl font-bold">5. Roadmap Temporal</h2>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Pipeline de entregas por trimestre.
        </p>
        <p className="text-xs font-medium text-[var(--btg-color-text)]">
          Insight: predominio atual em horizonte {dominantHorizon}.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {roadmapByQuarter.map((bucket) => (
          <article
            key={bucket.quarter}
            className={`rounded-xl border border-[var(--btg-color-border)] p-4 ${quarterColors[bucket.quarter]}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold">
                {bucket.quarter} <span className="font-medium">{bucket.items[0]?.year ?? "-"}</span>
              </h3>
              <p className="text-xs text-[var(--btg-color-text-muted)]">
                {formatNumber(bucket.items.length)} iniciativas
              </p>
            </div>

            <div className="mb-3 rounded-md bg-white/80 px-2 py-1 text-xs text-[var(--btg-color-text-muted)]">
              Esforco: {formatNumber(bucket.hours)}h | Custo: {formatCurrencyBRL(bucket.cost)}
            </div>

            <div className="space-y-2">
              {bucket.items.length === 0 ? (
                <p className="text-sm text-[var(--btg-color-text-muted)]">
                  Sem iniciativas neste quarter.
                </p>
              ) : (
                bucket.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-[var(--btg-color-border)] bg-white p-3"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{item.initiative}</p>
                      <div className="flex items-center gap-1">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${horizonBadge[item.horizon]}`}
                        >
                          {item.horizon}
                        </span>
                        <span className="rounded-full border border-[var(--btg-color-border)] px-2 py-0.5 text-[11px] font-semibold uppercase text-[var(--btg-color-text-muted)]">
                          {item.prioridade}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--btg-color-text-muted)]">
                      {item.squad} | {String(item.start_date)} ate {String(item.end_date)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
