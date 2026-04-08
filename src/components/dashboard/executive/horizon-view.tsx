import type { Initiative } from "@/types/initiative";
import { formatNumber } from "@/lib/format";
import { calculateHorizonMetrics } from "@/lib/executive-metrics";

type HorizonViewProps = {
  items: Initiative[];
};

const horizonLabels: Record<Initiative["horizon"], string> = {
  curto: "Curto prazo",
  medio: "Medio prazo",
  longo: "Longo prazo",
};

function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`;
}

export function HorizonView({ items }: HorizonViewProps) {
  const metrics = calculateHorizonMetrics(items);
  const dominant = [...metrics].sort((a, b) => b.effortShare - a.effortShare)[0];

  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-xl font-bold">4. Pipeline de Entregas</h2>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Curto, medio e longo prazo em visao unica.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[var(--btg-color-surface)] text-xs uppercase tracking-wide text-[var(--btg-color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Horizonte</th>
              <th className="px-4 py-3 font-medium">Iniciativas</th>
              <th className="px-4 py-3 font-medium">% do portfolio</th>
              <th className="px-4 py-3 font-medium">Esforco (h)</th>
              <th className="px-4 py-3 font-medium">% do esforco</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((item) => (
              <tr
                key={item.horizon}
                className="border-t border-[var(--btg-color-border)]"
              >
                <td className="px-4 py-3 text-sm font-semibold">
                  {horizonLabels[item.horizon]}
                </td>
                <td className="px-4 py-3 text-sm">{formatNumber(item.count)}</td>
                <td className="px-4 py-3 text-sm">
                  {formatPercent(item.countShare)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatNumber(item.effortHours)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatPercent(item.effortShare)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-[var(--btg-color-text)]">
        Insight:{" "}
        <span className="font-semibold">
          {dominant
            ? `${horizonLabels[dominant.horizon]} concentra ${formatPercent(dominant.effortShare)} do esforco planejado.`
            : "Sem distribuicao relevante de esforco."}
        </span>
      </p>
    </section>
  );
}
