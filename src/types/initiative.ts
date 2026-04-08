import type {
  Horizon,
  Quarter,
  Prioridade,
  InitiativeStatus,
  StrategicAlignment,
  StrategicGoal,
  WorkType,
} from "@/types/enums";

export interface InitiativeBase {
  id: string;
  squad: string;
  owner: string;
  initiative: string;
  horizon: Horizon;
  start_date: string | Date;
  end_date: string | Date;
  quarter: Quarter;
  year: number;
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
