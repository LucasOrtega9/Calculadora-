import type {
  Horizon,
  InitiativeStatus,
  StrategicAlignment,
} from "@/types/enums";

// Tipo de compatibilidade para manter a UI atual sem alteracao de layout.
export interface PortfolioItem {
  id: string;
  squad: string;
  initiative: string;
  horizon: Horizon;
  effortPoints: number;
  monthlyInternalCost: number;
  strategicAlignment: StrategicAlignment;
  status: InitiativeStatus;
}

export type {
  Horizon,
  Prioridade,
  InitiativeStatus,
  StrategicAlignment,
  StrategicGoal,
  WorkType,
} from "@/types/enums";

export type { Initiative } from "@/types/initiative";
