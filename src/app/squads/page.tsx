import { DashboardHeader } from "@/components/dashboard/header";
import { SquadSection } from "@/components/squads/squad-section";
import { getInitiatives } from "@/services/portfolio.service";
import { groupInitiativesBySquad } from "@/lib/squads/squad-metrics";

export default async function SquadsPage() {
  const initiatives = await getInitiatives();
  const squads = groupInitiativesBySquad(initiatives);

  return (
    <main className="min-h-screen bg-[var(--btg-color-bg)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-[var(--btg-space-7)] px-[var(--btg-space-5)] py-[var(--btg-space-6)]">
        <DashboardHeader />

        <section className="rounded-2xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[var(--btg-color-text)]">
            Visao por Squad
          </h2>
          <p className="mt-1 text-sm text-[var(--btg-color-text-muted)]">
            Leitura executiva da concentracao de esforco, custo e pipeline por squad.
          </p>
        </section>

        <div className="space-y-[var(--btg-space-7)]">
          {squads.map((squad) => (
            <SquadSection key={squad.squadName} squadMetrics={squad} />
          ))}
        </div>
      </div>
    </main>
  );
}
