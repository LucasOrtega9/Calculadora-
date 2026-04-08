import { formatCurrencyBRL, formatNumber } from "@/lib/format";
import {
  calculateExecutiveMetrics,
  countByStrategicAlignment,
} from "@/lib/executive-metrics";
import type { Initiative } from "@/types/initiative";

type ExecutiveSummaryProps = {
  items: Initiative[];
};

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <article className="rounded-xl border border-[var(--btg-color-border)] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-[var(--btg-color-text-muted)]">{title}</p>
      <p className="mt-2 text-2xl font-bold text-[var(--btg-color-text)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--btg-color-text-muted)]">{subtitle}</p>
    </article>
  );
}

export function ExecutiveSummary({ items }: ExecutiveSummaryProps) {
  const metrics = calculateExecutiveMetrics(items);
  const alignmentCount = countByStrategicAlignment(items);
  const formatPercent = (value: number) =>
    `${new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(value)}%`;

  return (
    <section className="space-y-5 rounded-2xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-[var(--btg-color-text)]">
          1. Resumo Executivo
        </h2>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Visao consolidada em um bloco unico.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total de iniciativas"
          value={formatNumber(metrics.totalInitiatives)}
          subtitle="Escopo total"
        />
        <StatCard
          title="Horas planejadas"
          value={formatNumber(metrics.totalEstimatedHours)}
          subtitle="Carga consolidada"
        />
        <StatCard
          title="Custo total"
          value={formatCurrencyBRL(metrics.totalCost)}
          subtitle="Investimento agregado"
        />
        <StatCard
          title="Custo medio por iniciativa"
          value={formatCurrencyBRL(metrics.averageCostPerInitiative)}
          subtitle="Referencia executiva"
        />
      </div>

      <div className="rounded-xl border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-4">
        <p className="text-xs font-semibold tracking-wide text-[var(--btg-color-text-muted)] uppercase">
          Alinhamento estrategico
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--btg-color-success)]/20 px-3 py-1 text-sm font-semibold">
            Alto {formatPercent(metrics.alignmentPercentByLevel.alto)}
          </span>
          <span className="rounded-full bg-[var(--btg-color-warning)]/20 px-3 py-1 text-sm font-semibold">
            Medio {formatPercent(metrics.alignmentPercentByLevel.medio)}
          </span>
          <span className="rounded-full bg-[var(--btg-color-danger)]/15 px-3 py-1 text-sm font-semibold">
            Baixo {formatPercent(metrics.alignmentPercentByLevel.baixo)}
          </span>
        </div>
        <p className="mt-2 text-xs text-[var(--btg-color-text-muted)]">
          Base:{" "}
          {formatNumber(
            alignmentCount.alto + alignmentCount.medio + alignmentCount.baixo,
          )}{" "}
          iniciativas
        </p>
      </div>
    </section>
  );
}
