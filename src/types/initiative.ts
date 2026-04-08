import type {
  Horizon,
  Prioridade,
  InitiativeStatus,
  StrategicAlignment,
  StrategicGoal,
  WorkType,
} from "@/types/enums";

export interface InitiativeBase {
  id: string;
  squad: string;
  initiative: string;
  horizon: Horizon;
  estimated_hours: number;
  cost_per_hour: number;
  work_type: WorkType;
  prioridade: Prioridade;
  business_area: string;
  strategic_goal: StrategicGoal;
  strategic_alignment: StrategicAlignment;
  status: InitiativeStatus;
}

export type InitiativeInput = InitiativeBase;

export interface Initiative extends InitiativeBase {
  total_cost: number;
}
