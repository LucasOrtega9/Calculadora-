export type Horizon = "curto" | "medio" | "longo";

export type StrategicAlignment = "alto" | "medio" | "baixo";

export type InitiativeStatus =
  | "planejado"
  | "em-andamento"
  | "concluido"
  | "bloqueado";

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
