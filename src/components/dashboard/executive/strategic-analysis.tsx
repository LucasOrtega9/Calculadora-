import { formatNumber } from "@/lib/format";
import { buildExecutiveDashboardMetrics } from "@/lib/executive-metrics";
import type { Initiative } from "@/types/initiative";

type StrategicAnalysisProps = {
  items: Initiative[];
};

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <article className="rounded-lg border border-[var(--btg-color-border)] bg-white p-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--btg-color-text)]">
        {title}
      </h3>
      {subtitle ? (
        <p className="mt-1 text-xs text-[var(--btg-color-text-muted)]">{subtitle}</p>
      ) : null}
      <div className="mt-3">{children}</div>
    </article>
  );
}

type RowProps = {
  label: string;
  value: number;
};

function PercentRow({ label, value }: RowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="capitalize text-[var(--btg-color-text-muted)]">{label}</span>
      <span className="font-semibold text-[var(--btg-color-text)]">
        {`${formatNumber(Number(value.toFixed(1)))}%`}
      </span>
    </div>
  );
}

export function StrategicAnalysis({ items }: StrategicAnalysisProps) {
  const metrics = buildExecutiveDashboardMetrics(items).strategicAnalysis;
  const strategyTop3 = metrics.effortByStrategicGoal.slice(0, 3);
  const workTypeTop3 = metrics.workTypeEffort.slice(0, 3);
  const formatPercent = (value: number) =>
    `${new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(value)}%`;

  const keyMessage =
    metrics.runEffortPercent >= 45
      ? "Alto peso em run reduz a capacidade de transformacao."
      : metrics.highAlignmentEffortPercent < 50
        ? "Alinhamento alto abaixo do esperado para agenda executiva."
        : "Foco estrategico equilibrado entre execucao e direcionamento.";

  return (
    <section className="space-y-4 rounded-xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
      <header className="space-y-1">
        <h2 className="text-xl font-bold text-[var(--btg-color-text)]">
          6. Analise Estrategica
        </h2>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Foco final para decisao C-level.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--btg-color-text-muted)]">
            Alinhamento alto
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--btg-color-primary)]">
            {formatPercent(metrics.highAlignmentEffortPercent)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--btg-color-text-muted)]">
            Esforco em run
          </p>
          <p
            className={`mt-1 text-2xl font-bold ${
              metrics.runEffortPercent >= 45
                ? "text-[var(--btg-color-danger)]"
                : "text-[var(--btg-color-text)]"
            }`}
          >
            {formatPercent(metrics.runEffortPercent)}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--btg-color-text-muted)]">
            Esforco em prioridade alta/critica
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--btg-color-text)]">
            {formatPercent(metrics.criticalAndHighEffortPercent)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Objetivo estrategico">
          <div className="space-y-2">
            {strategyTop3.map((item) => (
              <PercentRow
                key={String(item.key)}
                label={String(item.key)}
                value={item.percentage}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Tipo de trabalho">
          <div className="space-y-2">
            {workTypeTop3.map((item) => (
              <PercentRow
                key={String(item.key)}
                label={String(item.key)}
                value={item.percentage}
              />
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--btg-color-text-muted)]">
          Insight executivo
        </p>
        <p className="mt-1 text-sm text-[var(--btg-color-text)]">
          {keyMessage}
        </p>
      </div>
    </section>
  );
}
