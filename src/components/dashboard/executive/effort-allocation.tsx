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
  const top = rows[0];

  return (
    <article className="rounded-xl border border-[var(--btg-color-border)] bg-white p-4">
      <h3 className="mb-1 text-lg font-bold text-[var(--btg-color-text)]">
        {title}
      </h3>
      {top ? (
        <p className="mb-3 text-sm text-[var(--btg-color-text-muted)]">
          Maior concentracao em <span className="font-semibold">{top.label}</span> (
          {formatPercent(top.percent)}).
        </p>
      ) : null}
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
              <td
                className={`py-2 text-right font-semibold ${
                  row.percent >= 40 ? "text-[var(--btg-color-danger)]" : ""
                }`}
              >
                {formatPercent(row.percent)}
              </td>
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
    <section className="rounded-2xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
      <header className="mb-5 space-y-1">
        <h2 className="text-2xl font-bold text-[var(--btg-color-text)]">
          3. Alocacao de Esforco
        </h2>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Distribuicao de esforco.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <TableBlock title="Por tipo de trabalho" rows={byWorkType} />
        <TableBlock title="Por squad" rows={bySquad} />
        <TableBlock title="Por area de negocio" rows={byBusinessArea} />
      </div>
    </section>
  );
}
