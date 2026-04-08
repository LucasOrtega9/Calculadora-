import type { Initiative, InitiativeInput } from "@/types/initiative";

export function calculateTotalCost(
  estimated_hours: number,
  cost_per_hour: number,
): number {
  return estimated_hours * cost_per_hour;
}

export function enrichInitiativeWithTotalCost(
  item: InitiativeInput,
): Initiative {
  return {
    ...item,
    total_cost: calculateTotalCost(item.estimated_hours, item.cost_per_hour),
  };
}
