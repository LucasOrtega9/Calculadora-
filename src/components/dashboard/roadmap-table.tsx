import type { PortfolioItem } from "@/types/portfolio";
import { formatCurrencyBRL } from "@/lib/format";

type RoadmapTableProps = {
  items: PortfolioItem[];
};

const horizonStyles: Record<PortfolioItem["horizon"], string> = {
  curto: "bg-[color:var(--btg-color-info)]/15 text-[color:var(--btg-color-text)]",
  medio:
    "bg-[color:var(--btg-color-warning)]/20 text-[color:var(--btg-color-text)]",
  longo:
    "bg-[color:var(--btg-color-primary)]/15 text-[color:var(--btg-color-text)]",
};

const alignmentStyles: Record<PortfolioItem["strategicAlignment"], string> = {
  alto: "text-[color:var(--btg-color-success)]",
  medio: "text-[color:var(--btg-color-warning)]",
  baixo: "text-[color:var(--btg-color-danger)]",
};

export function RoadmapTable({ items }: RoadmapTableProps) {
  return (
    <section className="rounded-xl border border-[color:var(--btg-color-border)] bg-[color:var(--btg-color-bg)]">
      <header className="border-b border-[color:var(--btg-color-border)] px-6 py-4">
        <h2 className="text-xl font-bold">Roadmap por iniciativa</h2>
        <p className="text-sm text-[color:var(--btg-color-text-muted)]">
          Visao consolidada de esforco, custo interno e alinhamento estrategico.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[color:var(--btg-color-surface)] text-sm uppercase tracking-wide text-[color:var(--btg-color-text-muted)]">
            <tr>
              <th className="px-6 py-3 font-medium">Squad</th>
              <th className="px-6 py-3 font-medium">Iniciativa</th>
              <th className="px-6 py-3 font-medium">Horizonte</th>
              <th className="px-6 py-3 font-medium">Esforco (h)</th>
              <th className="px-6 py-3 font-medium">Custo interno</th>
              <th className="px-6 py-3 font-medium">Alinhamento</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-[color:var(--btg-color-border)] hover:bg-[color:var(--btg-color-hover-overlay)]"
              >
                <td className="px-6 py-4 text-sm font-medium">{item.squad}</td>
                <td className="px-6 py-4 text-sm">{item.initiative}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${horizonStyles[item.horizon]}`}
                  >
                    {item.horizon}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{item.effortPoints}</td>
                <td className="px-6 py-4 text-sm">
                  {formatCurrencyBRL(item.monthlyInternalCost)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`font-semibold uppercase ${alignmentStyles[item.strategicAlignment]}`}
                  >
                    {item.strategicAlignment}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
