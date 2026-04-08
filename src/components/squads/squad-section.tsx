import { SquadAlerts } from "@/components/squads/squad-alerts";
import { SquadEffortDistribution } from "@/components/squads/squad-effort-distribution";
import { SquadHorizonView } from "@/components/squads/squad-horizon-view";
import { SquadPipeline } from "@/components/squads/squad-pipeline";
import { SquadSummary } from "@/components/squads/squad-summary";
import type { SquadMetrics } from "@/lib/squads/squad-metrics";

type SquadSectionProps = {
  squadMetrics: SquadMetrics;
};

export function SquadSection({ squadMetrics }: SquadSectionProps) {
  return (
    <section className="rounded-2xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
      <header className="mb-5 flex items-start justify-between gap-4 border-b border-[var(--btg-color-border)] pb-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--btg-color-text-muted)] uppercase">
            Visao por Squad
          </p>
          <h2 className="text-xl font-bold text-[var(--btg-color-text)]">
            {squadMetrics.squadName}
          </h2>
        </div>
        <div className="rounded-md border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--btg-color-text-muted)]">
          {squadMetrics.totalInitiatives} iniciativas
        </div>
      </header>
      <div className="space-y-5">
        <SquadSummary metrics={squadMetrics} />
        <SquadEffortDistribution metrics={squadMetrics} />
        <SquadHorizonView metrics={squadMetrics} />
        <SquadPipeline metrics={squadMetrics} />
        <SquadAlerts squad={squadMetrics} />
      </div>
    </section>
  );
}
