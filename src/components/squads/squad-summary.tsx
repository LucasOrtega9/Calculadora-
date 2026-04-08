import { formatCurrencyBRL, formatNumber } from "@/lib/format";
import type { SquadMetrics } from "@/lib/squads/squad-metrics";

type SquadSummaryProps = {
  metrics: SquadMetrics;
};

export function SquadSummary({ metrics }: SquadSummaryProps) {
  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-white p-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--btg-color-text)]">
        Resumo do Squad
      </h3>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-3">
          <p className="text-xs text-[var(--btg-color-text-muted)]">Iniciativas</p>
          <p className="mt-1 text-xl font-bold">{formatNumber(metrics.totalInitiatives)}</p>
        </div>
        <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-3">
          <p className="text-xs text-[var(--btg-color-text-muted)]">Horas planejadas</p>
          <p className="mt-1 text-xl font-bold">{formatNumber(metrics.totalHours)}</p>
        </div>
        <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-3">
          <p className="text-xs text-[var(--btg-color-text-muted)]">Custo total</p>
          <p className="mt-1 text-xl font-bold">{formatCurrencyBRL(metrics.totalCost)}</p>
        </div>
        <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-3">
          <p className="text-xs text-[var(--btg-color-text-muted)]">Owners principais</p>
          <p className="mt-1 text-sm font-semibold">{metrics.mainOwners.join(", ")}</p>
        </div>
      </div>
    </section>
  );
}
