import type { Initiative } from "@/types/initiative";

export type InitiativeDetailViewModel = {
  initiative: Initiative;
  contextSummary: string;
  portfolioInterpretation: string;
  alerts: {
    lowPriorityHighCost: boolean;
    lowAlignment: boolean;
    longTermHighEffort: boolean;
    riskyStatus: boolean;
    insight: string;
  };
};

function buildStrategicContextSummary(item: Initiative): string {
  return `${item.initiative} conduz ${item.strategic_goal} na vertical ${item.business_area}, com ownership de ${item.owner}.`;
}

function buildPortfolioInterpretation(item: Initiative): string {
  const horizonText: Record<Initiative["horizon"], string> = {
    curto: "entrega de curto prazo",
    medio: "entrega de medio prazo",
    longo: "movimento estrutural de longo prazo",
  };

  const alignmentText: Record<Initiative["strategic_alignment"], string> = {
    alto: "alto alinhamento estrategico",
    medio: "alinhamento estrategico intermediario",
    baixo: "baixo alinhamento estrategico",
  };

  return `Representa ${horizonText[item.horizon]}, com ${alignmentText[item.strategic_alignment]} para o portfolio.`;
}

function buildInitiativeAlerts(item: Initiative): InitiativeDetailViewModel["alerts"] {
  const lowPriorityHighCost =
    item.prioridade === "baixa" && item.total_cost >= 120000;
  const lowAlignment = item.strategic_alignment === "baixo";
  const longTermHighEffort = item.horizon === "longo" && item.estimated_hours >= 700;
  const riskyStatus = item.status === "em_risco" || item.status === "bloqueado";

  const hasAlert =
    lowPriorityHighCost || lowAlignment || longTermHighEffort || riskyStatus;

  return {
    lowPriorityHighCost,
    lowAlignment,
    longTermHighEffort,
    riskyStatus,
    insight: hasAlert
      ? "Iniciativa com sinais de atencao executiva para custo, foco ou entrega."
      : "Iniciativa sem alertas criticos no momento.",
  };
}

export function buildInitiativeDetailViewModel(
  item: Initiative,
): InitiativeDetailViewModel {
  return {
    initiative: item,
    contextSummary: buildStrategicContextSummary(item),
    portfolioInterpretation: buildPortfolioInterpretation(item),
    alerts: buildInitiativeAlerts(item),
  };
}

export function getInitiativeById(
  initiatives: Initiative[],
  id: string,
): Initiative | undefined {
  return initiatives.find((item) => item.id === id);
}
