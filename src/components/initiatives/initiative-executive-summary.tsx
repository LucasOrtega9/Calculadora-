import { formatCurrencyBRL, formatNumber } from "@/lib/format";
import type { Initiative } from "@/types/initiative";

type InitiativeExecutiveSummaryProps = {
  initiative: Initiative;
};

export function InitiativeExecutiveSummary({
  initiative,
}: InitiativeExecutiveSummaryProps) {
  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-[var(--btg-color-text)]">
        2. Resumo Executivo
      </h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-3">
          <p className="text-xs text-[var(--btg-color-text-muted)]">
            Horas estimadas
          </p>
          <p className="mt-1 text-xl font-bold">
            {formatNumber(initiative.estimated_hours)}
          </p>
        </article>
        <article className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-3">
          <p className="text-xs text-[var(--btg-color-text-muted)]">
            Custo por hora
          </p>
          <p className="mt-1 text-xl font-bold">
            {formatCurrencyBRL(initiative.cost_per_hour)}
          </p>
        </article>
        <article className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-3">
          <p className="text-xs text-[var(--btg-color-text-muted)]">Custo total</p>
          <p className="mt-1 text-xl font-bold">
            {formatCurrencyBRL(initiative.total_cost)}
          </p>
        </article>
        <article className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-3">
          <p className="text-xs text-[var(--btg-color-text-muted)]">
            Objetivo estrategico
          </p>
          <p className="mt-1 text-sm font-bold capitalize">
            {initiative.strategic_goal}
          </p>
        </article>
        <article className="rounded-lg border border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] p-3">
          <p className="text-xs text-[var(--btg-color-text-muted)]">
            Area de negocio
          </p>
          <p className="mt-1 text-sm font-bold">{initiative.business_area}</p>
        </article>
      </div>
    </section>
  );
}
