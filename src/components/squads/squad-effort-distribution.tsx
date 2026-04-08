import type { SquadMetrics } from "@/lib/squads/squad-metrics";

type SquadEffortDistributionProps = {
  metrics: SquadMetrics;
};

function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

type DistributionBlockProps = {
  title: string;
  rows: { label: string; percentage: number }[];
};

function DistributionBlock({ title, rows }: DistributionBlockProps) {
  return (
    <article className="rounded-xl border border-[var(--btg-color-border)] bg-white p-4">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">{title}</h3>
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase text-[var(--btg-color-text-muted)]">
          <tr>
            <th className="pb-2 font-medium">Dimensao</th>
            <th className="pb-2 text-right font-medium">Esforco (%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-[var(--btg-color-border)]">
              <td className="py-2 capitalize">{row.label}</td>
              <td className="py-2 text-right font-semibold">
                {formatPercent(row.percentage)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

export function SquadEffortDistribution({ metrics }: SquadEffortDistributionProps) {
  return (
    <section className="space-y-3">
      <header>
        <h3 className="text-base font-bold">Distribuicao de Esforco</h3>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Concentracao por tipo, vertical e objetivo.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <DistributionBlock
          title="% por work_type"
          rows={metrics.byWorkType}
        />
        <DistributionBlock
          title="% por business_area"
          rows={metrics.byBusinessArea}
        />
        <DistributionBlock
          title="% por strategic_goal"
          rows={metrics.byStrategicGoal}
        />
      </div>
    </section>
  );
}
