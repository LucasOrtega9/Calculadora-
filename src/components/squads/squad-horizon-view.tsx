import { formatNumber } from "@/lib/format";
import type { SquadMetrics } from "@/lib/squads/squad-metrics";

type SquadHorizonViewProps = {
  metrics: SquadMetrics;
};

const horizonLabel: Record<keyof SquadMetrics["horizonCount"], string> = {
  curto: "Curto",
  medio: "Medio",
  longo: "Longo",
};

export function SquadHorizonView({ metrics }: SquadHorizonViewProps) {
  return (
    <section className="rounded-lg border border-[var(--btg-color-border)] bg-white p-4">
      <h3 className="text-base font-bold">Visao de Horizonte</h3>
      <table className="mt-3 min-w-full text-left text-sm">
        <thead className="text-xs uppercase text-[var(--btg-color-text-muted)]">
          <tr>
            <th className="pb-2 font-medium">Horizonte</th>
            <th className="pb-2 text-right font-medium">Iniciativas</th>
            <th className="pb-2 text-right font-medium">Horas</th>
          </tr>
        </thead>
        <tbody>
          {(
            Object.keys(metrics.horizonCount) as Array<
              keyof SquadMetrics["horizonCount"]
            >
          ).map(
            (key) => (
              <tr key={key} className="border-t border-[var(--btg-color-border)]">
                <td className="py-2 font-medium">{horizonLabel[key]}</td>
                <td className="py-2 text-right">
                  {formatNumber(metrics.horizonCount[key])}
                </td>
                <td className="py-2 text-right">
                  {formatNumber(metrics.horizonHours[key])}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-[var(--btg-color-text-muted)]">
        Leitura: equilibrio entre curto, medio e longo reduz risco de agenda.
      </p>
    </section>
  );
}
