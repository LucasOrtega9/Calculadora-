import { DashboardHeader } from "@/components/dashboard/header";
import { AlertsAndDeviations } from "@/components/dashboard/executive/alerts-and-deviations";
import { EffortAllocation } from "@/components/dashboard/executive/effort-allocation";
import { ExecutiveSummary } from "@/components/dashboard/executive/executive-summary";
import { HorizonView } from "@/components/dashboard/executive/horizon-view";
import { StrategicAnalysis } from "@/components/dashboard/executive/strategic-analysis";
import { TemporalRoadmap } from "@/components/dashboard/executive/temporal-roadmap";
import { getInitiatives } from "@/services/portfolio.service";

export default async function Home() {
  const items = await getInitiatives();

  return (
    <main className="min-h-screen bg-[var(--btg-color-bg)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-[var(--btg-space-7)] px-[var(--btg-space-5)] py-[var(--btg-space-6)]">
        <DashboardHeader />

        <ExecutiveSummary items={items} />

        <AlertsAndDeviations items={items} />

        <EffortAllocation items={items} />

        <HorizonView items={items} />

        <TemporalRoadmap items={items} />

        <StrategicAnalysis items={items} />
      </div>
    </main>
  );
}
