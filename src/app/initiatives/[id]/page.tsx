import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { InitiativeAlerts } from "@/components/initiatives/initiative-alerts";
import { InitiativeExecutiveSummary } from "@/components/initiatives/initiative-executive-summary";
import { InitiativeHeader } from "@/components/initiatives/initiative-header";
import { InitiativeStrategicContext } from "@/components/initiatives/initiative-strategic-context";
import { InitiativeTimeline } from "@/components/initiatives/initiative-timeline";
import {
  buildInitiativeDetailViewModel,
  getInitiativeById,
} from "@/lib/initiatives/initiative-detail";
import { getInitiatives } from "@/services/portfolio.service";

type InitiativeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function InitiativeDetailPage({
  params,
}: InitiativeDetailPageProps) {
  const { id } = await params;
  const initiatives = await getInitiatives();
  const initiative = getInitiativeById(initiatives, id);

  if (!initiative) {
    notFound();
  }

  const detail = buildInitiativeDetailViewModel(initiative);

  return (
    <main className="min-h-screen bg-[var(--btg-color-bg)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-[var(--btg-space-7)] px-[var(--btg-space-5)] py-[var(--btg-space-6)]">
        <DashboardHeader />

        <InitiativeHeader initiative={detail.initiative} />
        <InitiativeExecutiveSummary initiative={detail.initiative} />
        <InitiativeTimeline initiative={detail.initiative} />
        <InitiativeStrategicContext
          initiative={detail.initiative}
          contextSummary={detail.contextSummary}
          portfolioInterpretation={detail.portfolioInterpretation}
        />
        <InitiativeAlerts
          alerts={detail.alerts}
          alertInsight={detail.alerts.insight}
        />
      </div>
    </main>
  );
}
