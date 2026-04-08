import { formatCurrencyBRL, formatNumber } from "@/lib/format";
import {
  calculateExecutiveMetrics,
} from "@/lib/executive-metrics";
import type { Initiative } from "@/types/initiative";

type ExecutiveSummaryProps = {
  items: Initiative[];
};

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  valueClassName?: string;
};

function StatCard({ title, value, subtitle, valueClassName }: StatCardProps) {
  return (
    <article className="rounded-xl border border-[var(--btg-color-border)] bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold tracking-wide text-[var(--btg-color-text-muted)] uppercase">
        {title}
      </p>
      <p
        className={`mt-2 text-2xl font-bold text-[var(--btg-color-text)] ${valueClassName ?? ""}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-[var(--btg-color-text-muted)]">{subtitle}</p>
    </article>
  );
}

export function ExecutiveSummary({ items }: ExecutiveSummaryProps) {
  const metrics = calculateExecutiveMetrics(items);
  const highAlignment = metrics.alignmentPercentByLevel.alto;
  const formatPercent = (value: number) =>
    `${new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(value)}%`;

  const alignmentValueClassName =
    highAlignment < 50
      ? "text-[var(--btg-color-danger)]"
      : highAlignment < 65
        ? "text-[var(--btg-color-warning)]"
        : "text-[var(--btg-color-success)]";

  const executiveInsight =
    highAlignment < 50
      ? "Alinhamento alto abaixo do ideal: revisar priorizacao para ampliar foco estrategico."
      : "Foco estrategico consistente com boa concentracao em iniciativas de alto alinhamento.";

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
      <header className="space-y-1">
        <h2 className="text-xl font-bold text-[var(--btg-color-text)]">1. Resumo Executivo</h2>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Principais indicadores para leitura imediata.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total de iniciativas"
          value={formatNumber(metrics.totalInitiatives)}
          subtitle="Escopo do portfolio"
        />
        <StatCard
          title="Esforco total"
          value={formatNumber(metrics.totalEstimatedHours)}
          subtitle="Horas planejadas"
        />
        <StatCard
          title="Custo total"
          value={formatCurrencyBRL(metrics.totalCost)}
          subtitle="Investimento previsto"
        />
        <StatCard
          title="Alinhamento alto"
          value={formatPercent(highAlignment)}
          subtitle="Percentual do portfolio"
          valueClassName={alignmentValueClassName}
        />
      </div>

      <div className="rounded-xl border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] px-4 py-3">
        <p className="text-xs font-semibold tracking-wide text-[var(--btg-color-text-muted)] uppercase">
          Insight automatico
        </p>
        <p className="mt-1 text-sm text-[var(--btg-color-text)]">{executiveInsight}</p>
      </div>
    </section>
  );
}
