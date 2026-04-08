import { SummaryCard } from "@/components/dashboard/summary-card";
import { formatCurrencyBRL } from "@/lib/currency";
import type { PortfolioSnapshot } from "@/types/portfolio";

type ExecutiveSummaryProps = {
  snapshot: PortfolioSnapshot;
};

export function ExecutiveSummary({ snapshot }: ExecutiveSummaryProps) {
  const strategicRate = Math.round(snapshot.highAlignmentRate * 100);

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Squads ativos"
        value={snapshot.totalSquads.toString()}
      />
      <SummaryCard
        label="Iniciativas mapeadas"
        value={snapshot.totalInitiatives.toString()}
      />
      <SummaryCard
        label="Esforço total estimado"
        value={`${snapshot.totalEffort.toLocaleString("pt-BR")} pontos`}
      />
      <SummaryCard
        label="Custo interno total"
        value={formatCurrencyBRL(snapshot.totalCost)}
        helper={`${strategicRate}% das iniciativas com alto alinhamento estratégico`}
      />
    </section>
  );
}
