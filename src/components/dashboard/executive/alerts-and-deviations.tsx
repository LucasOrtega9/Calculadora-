import { buildExecutiveDashboardMetrics } from "@/lib/executive-metrics";
import { formatNumber } from "@/lib/format";
import type { Initiative } from "@/types/initiative";

type AlertsAndDeviationsProps = {
  items: Initiative[];
};

function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

function getStatus(
  value: number,
  highThreshold: number,
  mediumThreshold: number,
): { label: string; className: string } {
  if (value >= highThreshold) {
    return {
      label: "Critico",
      className:
        "border-[color:var(--btg-color-danger)]/40 bg-[color:var(--btg-color-danger)]/15 text-[color:var(--btg-color-danger)]",
    };
  }

  if (value >= mediumThreshold) {
    return {
      label: "Atencao",
      className:
        "border-[color:var(--btg-color-warning)]/50 bg-[color:var(--btg-color-warning)]/20 text-[color:var(--btg-color-text)]",
    };
  }

  return {
    label: "Controlado",
    className:
      "border-[color:var(--btg-color-success)]/40 bg-[color:var(--btg-color-success)]/15 text-[color:var(--btg-color-text)]",
  };
}

export function AlertsAndDeviations({ items }: AlertsAndDeviationsProps) {
  const metrics = buildExecutiveDashboardMetrics(items).strategicAnalysis;

  const runStatus = getStatus(metrics.runEffortPercent, 45, 35);
  const lowAlignmentStatus = getStatus(
    100 - metrics.highAlignmentEffortPercent,
    50,
    35,
  );
  const lowPriorityStatus = getStatus(
    100 - metrics.criticalAndHighEffortPercent,
    40,
    25,
  );

  return (
    <section className="rounded-2xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
      <header className="mb-5">
        <h2 className="text-xl font-bold text-[var(--btg-color-text)]">
          Alertas e Desvios Estrategicos
        </h2>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Sinais executivos de risco e concentracao de esforco.
        </p>
      </header>

      <div className="mb-5 grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--btg-color-text-muted)]">
            Concentracao em Run
          </p>
          <p className="mt-2 text-2xl font-bold">{formatPercent(metrics.runEffortPercent)}</p>
          <span
            className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${runStatus.className}`}
          >
            {runStatus.label}
          </span>
        </article>

        <article className="rounded-xl border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--btg-color-text-muted)]">
            Baixo alinhamento (nao alto)
          </p>
          <p className="mt-2 text-2xl font-bold">
            {formatPercent(100 - metrics.highAlignmentEffortPercent)}
          </p>
          <span
            className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${lowAlignmentStatus.className}`}
          >
            {lowAlignmentStatus.label}
          </span>
        </article>

        <article className="rounded-xl border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-4">
          <p className="text-xs font-semibold uppercase text-[var(--btg-color-text-muted)]">
            Fora de prioridade critica/alta
          </p>
          <p className="mt-2 text-2xl font-bold">
            {formatPercent(100 - metrics.criticalAndHighEffortPercent)}
          </p>
          <span
            className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${lowPriorityStatus.className}`}
          >
            {lowPriorityStatus.label}
          </span>
        </article>
      </div>

      <div className="rounded-xl border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-4">
        <p className="mb-3 text-sm font-semibold text-[var(--btg-color-text)]">
          Pontos de atencao ({formatNumber(metrics.deviations.length)})
        </p>
        <ul className="space-y-2">
          {metrics.deviations.map((deviation) => (
            <li
              key={deviation}
              className="rounded-lg border border-[var(--btg-color-warning)]/50 bg-[var(--btg-color-warning)]/15 px-3 py-2 text-sm text-[var(--btg-color-text)]"
            >
              {deviation}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
