import { formatCurrencyBRL, formatNumber } from "@/lib/format";
import type { Quarter } from "@/types/enums";
import type { SquadMetrics } from "@/lib/squads/squad-metrics";

type SquadPipelineProps = {
  metrics: SquadMetrics;
};

const quarterOrder: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];

const horizonBadgeClassName = {
  curto: "bg-[var(--btg-color-info)]/20 text-[var(--btg-color-text)]",
  medio: "bg-[var(--btg-color-warning)]/20 text-[var(--btg-color-text)]",
  longo: "bg-[var(--btg-color-primary)]/15 text-[var(--btg-color-text)]",
};

const alignmentBadgeClassName = {
  alto: "bg-[var(--btg-color-success)]/20 text-[var(--btg-color-text)]",
  medio: "bg-[var(--btg-color-warning)]/20 text-[var(--btg-color-text)]",
  baixo: "bg-[var(--btg-color-danger)]/15 text-[var(--btg-color-text)]",
};

const priorityBadgeClassName = {
  critica:
    "border-[var(--btg-color-danger)]/40 bg-[var(--btg-color-danger)]/15 text-[var(--btg-color-danger)]",
  alta: "border-[var(--btg-color-warning)]/40 bg-[var(--btg-color-warning)]/20 text-[var(--btg-color-text)]",
  media: "border-[var(--btg-color-info)]/40 bg-[var(--btg-color-info)]/15 text-[var(--btg-color-text)]",
  baixa:
    "border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] text-[var(--btg-color-text-muted)]",
};

export function SquadPipeline({ metrics }: SquadPipelineProps) {
  const byQuarterMap = new Map(
    metrics.byQuarter.map((bucket) => [`${bucket.year}-${bucket.quarter}`, bucket]),
  );
  const years = Array.from(new Set(metrics.byQuarter.map((item) => item.year))).sort(
    (a, b) => a - b,
  );

  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-white p-5">
      <header className="mb-4">
        <h4 className="text-base font-bold">Pipeline do squad</h4>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Iniciativas por quarter com prioridade, alinhamento e horizonte.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {years.flatMap((year) =>
          quarterOrder.map((quarter) => {
            const key = `${year}-${quarter}`;
            const bucket = byQuarterMap.get(key);
            const items = bucket?.initiatives ?? [];
            const totalHours = items.reduce((acc, item) => acc + item.estimated_hours, 0);
            const totalCost = items.reduce((acc, item) => acc + item.total_cost, 0);

            return (
              <article
                key={key}
                className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h5 className="text-sm font-semibold">
                    {quarter} {year}
                  </h5>
                  <span className="text-xs text-[var(--btg-color-text-muted)]">
                    {formatNumber(items.length)} iniciativas
                  </span>
                </div>

                <p className="mb-3 text-xs text-[var(--btg-color-text-muted)]">
                  Horas: {formatNumber(totalHours)} | Custo: {formatCurrencyBRL(totalCost)}
                </p>

                <div className="space-y-2">
                  {items.length === 0 ? (
                    <p className="text-sm text-[var(--btg-color-text-muted)]">Sem entregas no quarter.</p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-md border border-[var(--btg-color-border)] bg-white p-3"
                      >
                        <p className="text-sm font-semibold text-[var(--btg-color-text)]">
                          {item.initiative}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${horizonBadgeClassName[item.horizon]}`}
                          >
                            {item.horizon}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${alignmentBadgeClassName[item.strategic_alignment]}`}
                          >
                            {item.strategic_alignment}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${priorityBadgeClassName[item.prioridade]}`}
                          >
                            {item.prioridade}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </article>
            );
          }),
        )}
      </div>
    </section>
  );
}
