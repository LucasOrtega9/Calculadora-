import { DashboardHeader } from "@/components/dashboard/header";
import { RoadmapTable } from "@/components/dashboard/roadmap-table";
import { StrategicAlignment } from "@/components/dashboard/strategic-alignment";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { getPortfolioItems } from "@/services/portfolio.service";

export default async function Home() {
  const items = await getPortfolioItems();

  return (
    <main className="min-h-screen bg-[var(--btg-color-bg)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-[var(--btg-space-6)] px-[var(--btg-space-5)] py-[var(--btg-space-6)]">
        <DashboardHeader />

        <SummaryCards items={items} />

        <section className="rounded-xl border border-[var(--btg-color-border)] bg-white p-[var(--btg-space-5)] shadow-sm">
          <h2 className="mb-[var(--btg-space-4)] text-xl font-bold">
            Roadmap por horizonte
          </h2>
          <RoadmapTable items={items} />
        </section>

        <StrategicAlignment items={items} />
      </div>
    </main>
  );
}
