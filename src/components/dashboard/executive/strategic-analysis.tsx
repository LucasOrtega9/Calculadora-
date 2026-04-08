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
  const priorityBadgeClassName: Record<string, string> = {
    critica:
      "border-[var(--btg-color-danger)]/40 bg-[var(--btg-color-danger)]/12 text-[var(--btg-color-danger)]",
    alta: "border-[var(--btg-color-warning)]/40 bg-[var(--btg-color-warning)]/20 text-[var(--btg-color-text)]",
    media:
      "border-[var(--btg-color-info)]/40 bg-[var(--btg-color-info)]/16 text-[var(--btg-color-text)]",
    baixa: "border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] text-[var(--btg-color-text-muted)]",
  };

  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--btg-color-text)]">
            6. Analise Estrategica
          </h2>
          <p className="text-sm text-[var(--btg-color-text-muted)]">
            Validacao final do foco estrategico.
          </p>
        </div>
        <div className="rounded-md border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--btg-color-text-muted)]">
          Camada de suporte a decisao
        </div>
      </header>

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--btg-color-text-muted)]">
            Alinhamento alto
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--btg-color-text)]">
            {`${formatNumber(Number(metrics.highAlignmentEffortPercent.toFixed(1)))}%`}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--btg-color-text-muted)]">
            Esforco em run
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--btg-color-text)]">
            {`${formatNumber(Number(metrics.runEffortPercent.toFixed(1)))}%`}
          </p>
        </div>
        <div className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-4">
          <p className="text-xs uppercase tracking-wide text-[var(--btg-color-text-muted)]">
            Prioridade critica + alta
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--btg-color-text)]">
            {`${formatNumber(Number(metrics.criticalAndHighEffortPercent.toFixed(1)))}%`}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Esforco por objetivo estrategico">
          <div className="space-y-2">
            {metrics.effortByStrategicGoal.map((item) => (
              <PercentRow
                key={String(item.key)}
                label={String(item.key)}
                value={item.percentage}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Esforco por prioridade">
          <div className="space-y-2">
            {metrics.effortByPriority.map((item) => (
              <div
                key={String(item.key)}
                className="flex items-center justify-between"
              >
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${priorityBadgeClassName[String(item.key)] ?? priorityBadgeClassName.media}`}
                >
                  {String(item.key)}
                </span>
                <span className="text-sm font-semibold text-[var(--btg-color-text)]">
                  {`${formatNumber(Number(item.percentage.toFixed(1)))}%`}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Esforco por tipo">
          <div className="space-y-2">
            {metrics.workTypeEffort.map((item) => (
              <PercentRow
                key={String(item.key)}
                label={String(item.key)}
                value={item.percentage}
              />
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--btg-color-text-muted)]">
          Leitura executiva
        </p>
        <p className="mt-1 text-sm text-[var(--btg-color-text)]">
          Priorizar reducao de run elevado e elevar concentracao em alinhamento
          alto para maior retorno estrategico.
        </p>
      </div>
    </section>
  );
}
