import type { SquadRoadmap } from "@/types/portfolio";
import { formatCurrencyBRL } from "@/lib/currency";

type SquadRoadmapTableProps = {
  squads: SquadRoadmap[];
};

function phaseBadgeClass(phase: SquadRoadmap["phase"]) {
  switch (phase) {
    case "curto":
      return "bg-[var(--btg-color-info)]/20 text-[var(--btg-color-text)]";
    case "medio":
      return "bg-[var(--btg-color-warning)]/25 text-[var(--btg-color-text)]";
    case "longo":
      return "bg-[var(--btg-color-success)]/25 text-[var(--btg-color-text)]";
    default:
      return "bg-[var(--btg-color-surface)] text-[var(--btg-color-text-muted)]";
  }
}

function strategicBadgeClass(alignment: SquadRoadmap["strategicAlignment"]) {
  switch (alignment) {
    case "alto":
      return "bg-[var(--btg-color-success)]/20 text-[var(--btg-color-text)]";
    case "medio":
      return "bg-[var(--btg-color-warning)]/25 text-[var(--btg-color-text)]";
    case "baixo":
      return "bg-[var(--btg-color-danger)]/20 text-[var(--btg-color-text)]";
    default:
      return "bg-[var(--btg-color-surface)] text-[var(--btg-color-text-muted)]";
  }
}

export function SquadRoadmapTable({ squads }: SquadRoadmapTableProps) {
  return (
    <section className="rounded-2xl border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-6">
      <header className="mb-5">
        <h2 className="text-xl font-bold tracking-tight">Planejamento por squad</h2>
        <p className="mt-1 text-sm text-[var(--btg-color-text-muted)]">
          Visão consolidada do curto, médio e longo prazo.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--btg-color-border)] text-left">
              <th className="py-3 pr-4 font-medium text-[var(--btg-color-text-muted)]">Squad</th>
              <th className="py-3 pr-4 font-medium text-[var(--btg-color-text-muted)]">Iniciativa</th>
              <th className="py-3 pr-4 font-medium text-[var(--btg-color-text-muted)]">Prazo</th>
              <th className="py-3 pr-4 font-medium text-[var(--btg-color-text-muted)]">Esforço</th>
              <th className="py-3 pr-4 font-medium text-[var(--btg-color-text-muted)]">Custo interno</th>
              <th className="py-3 pr-4 font-medium text-[var(--btg-color-text-muted)]">
                Alinhamento estratégico
              </th>
              <th className="py-3 font-medium text-[var(--btg-color-text-muted)]">Atualizado em</th>
            </tr>
          </thead>
          <tbody>
            {squads.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[var(--btg-color-border)] last:border-b-0 hover:bg-[var(--btg-color-hover-overlay)]"
              >
                <td className="py-3 pr-4 font-medium">{item.squadName}</td>
                <td className="py-3 pr-4">{item.initiative}</td>
                <td className="py-3 pr-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${phaseBadgeClass(item.phase)}`}>
                    {item.phase}
                  </span>
                </td>
                <td className="py-3 pr-4">{item.effortPoints} pts</td>
                <td className="py-3 pr-4">{formatCurrencyBRL(item.internalCostBRL)}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${strategicBadgeClass(item.strategicAlignment)}`}
                  >
                    {item.strategicAlignment}
                  </span>
                </td>
                <td className="py-3">{item.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
