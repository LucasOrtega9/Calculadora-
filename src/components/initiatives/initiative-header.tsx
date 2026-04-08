import type { Initiative } from "@/types/initiative";

type InitiativeHeaderProps = {
  initiative: Initiative;
};

const horizonBadgeClassName = {
  curto: "bg-[var(--btg-color-info)]/18 text-[var(--btg-color-text)]",
  medio: "bg-[var(--btg-color-warning)]/20 text-[var(--btg-color-text)]",
  longo: "bg-[var(--btg-color-primary)]/16 text-[var(--btg-color-text)]",
};

const prioridadeBadgeClassName = {
  critica:
    "border-[var(--btg-color-danger)]/45 bg-[var(--btg-color-danger)]/15 text-[var(--btg-color-danger)]",
  alta: "border-[var(--btg-color-warning)]/45 bg-[var(--btg-color-warning)]/20 text-[var(--btg-color-text)]",
  media: "border-[var(--btg-color-info)]/45 bg-[var(--btg-color-info)]/18 text-[var(--btg-color-text)]",
  baixa:
    "border-[var(--btg-color-border)] bg-[var(--btg-color-surface)] text-[var(--btg-color-text-muted)]",
};

const alignmentBadgeClassName = {
  alto: "bg-[var(--btg-color-success)]/20 text-[var(--btg-color-text)]",
  medio: "bg-[var(--btg-color-warning)]/20 text-[var(--btg-color-text)]",
  baixo: "bg-[var(--btg-color-danger)]/14 text-[var(--btg-color-text)]",
};

const statusBadgeClassName = {
  ideia: "bg-[var(--btg-color-surface)] text-[var(--btg-color-text-muted)]",
  planejado: "bg-[var(--btg-color-info)]/15 text-[var(--btg-color-text)]",
  em_andamento: "bg-[var(--btg-color-primary)]/15 text-[var(--btg-color-text)]",
  em_risco: "bg-[var(--btg-color-warning)]/22 text-[var(--btg-color-text)]",
  bloqueado: "bg-[var(--btg-color-danger)]/15 text-[var(--btg-color-danger)]",
  concluido: "bg-[var(--btg-color-success)]/20 text-[var(--btg-color-text)]",
};

export function InitiativeHeader({ initiative }: InitiativeHeaderProps) {
  return (
    <section className="rounded-2xl border border-[var(--btg-color-border)] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[var(--btg-color-text-muted)] uppercase">
            Detalhe da Iniciativa
          </p>
          <h2 className="mt-1 text-2xl font-bold text-[var(--btg-color-text)]">
            {initiative.initiative}
          </h2>
          <p className="mt-2 text-sm text-[var(--btg-color-text-muted)]">
            Squad: {initiative.squad} | Owner: {initiative.owner}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusBadgeClassName[initiative.status]}`}
        >
          {initiative.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${horizonBadgeClassName[initiative.horizon]}`}
        >
          {initiative.horizon}
        </span>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${prioridadeBadgeClassName[initiative.prioridade]}`}
        >
          {initiative.prioridade}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${alignmentBadgeClassName[initiative.strategic_alignment]}`}
        >
          {initiative.strategic_alignment}
        </span>
      </div>
    </section>
  );
}
