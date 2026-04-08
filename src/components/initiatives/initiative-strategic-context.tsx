import type { Initiative } from "@/types/initiative";

type InitiativeStrategicContextProps = {
  initiative: Initiative;
  contextSummary: string;
  portfolioInterpretation: string;
};

const goalLabel: Record<Initiative["strategic_goal"], string> = {
  crescimento: "crescimento",
  eficiencia: "eficiencia operacional",
  compliance: "conformidade e risco",
};

const alignmentLabel: Record<Initiative["strategic_alignment"], string> = {
  alto: "alto alinhamento",
  medio: "alinhamento moderado",
  baixo: "baixo alinhamento",
};

export function InitiativeStrategicContext({
  initiative,
  contextSummary,
  portfolioInterpretation,
}: InitiativeStrategicContextProps) {
  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-[var(--btg-color-text)]">
        Contexto Estrategico
      </h3>

      <p className="mt-3 text-sm leading-6 text-[var(--btg-color-text)]">
        Esta iniciativa foca em {goalLabel[initiative.strategic_goal]}, com{" "}
        {alignmentLabel[initiative.strategic_alignment]} para a agenda executiva.
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--btg-color-text-muted)]">
        {contextSummary}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--btg-color-text-muted)]">
        {portfolioInterpretation}
      </p>
    </section>
  );
}
