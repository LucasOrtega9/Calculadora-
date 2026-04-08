import type { Initiative } from "@/types/initiative";

function formatPercent(value: number): string {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

type EffortAllocationProps = {
  items: Initiative[];
};

type BucketItem = {
  label: string;
  hours: number;
  percent: number;
};

function getBuckets(
  items: Initiative[],
  getLabel: (item: Initiative) => string,
): BucketItem[] {
  const totalHours = items.reduce((acc, item) => acc + item.estimated_hours, 0);
  const map = new Map<string, number>();

  for (const item of items) {
    const key = getLabel(item);
    const current = map.get(key) ?? 0;
    map.set(key, current + item.estimated_hours);
  }

  return [...map.entries()]
    .map(([label, hours]) => ({
      label,
      hours,
      percent: totalHours > 0 ? (hours / totalHours) * 100 : 0,
    }))
    .sort((a, b) => b.hours - a.hours);
}

function TableBlock({
  title,
  rows,
}: {
  title: string;
  rows: BucketItem[];
}) {
  return (
    <article className="rounded-xl border border-[var(--btg-color-border)] bg-white p-4">
      <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-[var(--btg-color-text)]">
        {title}
      </h3>
      <p className="mb-3 text-xs text-[var(--btg-color-text-muted)]">
        Distribuicao de horas planejadas
      </p>
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase text-[var(--btg-color-text-muted)]">
          <tr>
            <th className="pb-2 font-medium">Dimensao</th>
            <th className="pb-2 font-medium text-right">Esforco (%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-[var(--btg-color-border)]">
              <td className="py-2 font-medium">{row.label}</td>
              <td className="py-2 text-right font-semibold">{formatPercent(row.percent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

export function EffortAllocation({ items }: EffortAllocationProps) {
  const byWorkType = getBuckets(items, (item) => item.work_type.toUpperCase());
  const bySquad = getBuckets(items, (item) => item.squad);
  const byBusinessArea = getBuckets(items, (item) => item.business_area);

  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-xl font-bold">Alocacao de Esforco</h2>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Onde estamos consumindo energia no portfolio.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <TableBlock title="% por work_type" rows={byWorkType} />
        <TableBlock title="% por squad" rows={bySquad} />
        <TableBlock title="% por business_area" rows={byBusinessArea} />
      </div>
    </section>
  );
}
