export type PlanningHorizon = "curto" | "medio" | "longo";

export type StrategicAlignment = "alto" | "medio" | "baixo";

export interface SquadRoadmap {
  id: string;
  squadName: string;
  initiative: string;
  phase: PlanningHorizon;
  effortPoints: number;
  internalCostBRL: number;
  strategicAlignment: StrategicAlignment;
  updatedAt: string;
}

export interface PortfolioSnapshot {
  totalSquads: number;
  totalInitiatives: number;
  totalEffort: number;
  totalCost: number;
  highAlignmentRate: number;
}
