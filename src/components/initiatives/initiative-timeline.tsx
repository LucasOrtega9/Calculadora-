import type { Initiative } from "@/types/initiative";

type InitiativeTimelineProps = {
  initiative: Initiative;
};

function formatDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

export function InitiativeTimeline({ initiative }: InitiativeTimelineProps) {
  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-[var(--btg-color-text)]">
        3. Visao temporal
      </h3>

      <table className="mt-3 min-w-full text-left text-sm">
        <thead className="text-xs uppercase text-[var(--btg-color-text-muted)]">
          <tr>
            <th className="pb-2 font-medium">Inicio</th>
            <th className="pb-2 font-medium">Fim</th>
            <th className="pb-2 font-medium">Quarter</th>
            <th className="pb-2 font-medium">Ano</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-[var(--btg-color-border)]">
            <td className="py-2 font-medium">{formatDate(initiative.start_date)}</td>
            <td className="py-2 font-medium">{formatDate(initiative.end_date)}</td>
            <td className="py-2">{initiative.quarter}</td>
            <td className="py-2">{initiative.year}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
