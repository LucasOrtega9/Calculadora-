import { ExecutiveSummary } from "@/components/dashboard/executive-summary";
import { SquadRoadmapTable } from "@/components/dashboard/squad-roadmap-table";
import { AppShell } from "@/components/layout/app-shell";
import { getPortfolioData, getPortfolioSnapshot } from "@/services/portfolio.service";

export default async function Home() {
  const initiatives = await getPortfolioData();
  const snapshot = getPortfolioSnapshot();

  return (
    <AppShell
      title="Painel Executivo de Portfólio"
      subtitle="Visão consolidada por squad para planejamento de curto, médio e longo prazo."
    >
      <div className="space-y-6">
        <ExecutiveSummary snapshot={snapshot} />
        <SquadRoadmapTable squads={initiatives} />
      </div>
    </AppShell>
  );
}
