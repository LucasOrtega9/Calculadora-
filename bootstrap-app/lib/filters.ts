import { BudgetType, CostCenter, CostStatus } from "@prisma/client";

type SearchParamValue = string | string[] | undefined;
export type SearchParamsInput = Record<string, SearchParamValue>;

export type FilterCostCenter = CostCenter | "ALL";
export type FilterBudgetType = BudgetType | "ALL";
export type FilterCostStatus = CostStatus | "ALL";

export type DashboardFilters = {
  year: number;
  month: number | null;
  costCenter: FilterCostCenter;
  type: FilterBudgetType;
  lineId: string | null;
  status: FilterCostStatus;
};

const CURRENT_YEAR = new Date().getFullYear();

function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function parseIntOrNull(value: SearchParamValue) {
  const first = firstValue(value);
  if (!first) return null;
  const parsed = Number.parseInt(first, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function parseDashboardFilters(
  searchParams: SearchParamsInput,
  availableYears: number[],
): DashboardFilters {
  const preferredYear = availableYears.includes(2026)
    ? 2026
    : availableYears[0] ?? CURRENT_YEAR;

  const yearCandidate = parseIntOrNull(searchParams.year);
  const year =
    yearCandidate && Number.isFinite(yearCandidate) ? yearCandidate : preferredYear;

  const monthCandidate = parseIntOrNull(searchParams.month);
  const month =
    monthCandidate && monthCandidate >= 1 && monthCandidate <= 12
      ? monthCandidate
      : null;

  const center = firstValue(searchParams.costCenter);
  const validCenters: FilterCostCenter[] = ["ALL", "ENFORCE", "DA", "IP"];
  const costCenter = validCenters.includes(center as FilterCostCenter)
    ? (center as FilterCostCenter)
    : "ALL";

  const type = firstValue(searchParams.type);
  const validTypes: FilterBudgetType[] = ["ALL", "OPEX", "CAPEX"];
  const budgetType = validTypes.includes(type as FilterBudgetType)
    ? (type as FilterBudgetType)
    : "ALL";

  const statusValue = firstValue(searchParams.status);
  const validStatus: FilterCostStatus[] = [
    "ALL",
    "PLANNED",
    "COMMITTED",
    "PAID",
    "CANCELLED",
  ];
  const status = validStatus.includes(statusValue as FilterCostStatus)
    ? (statusValue as FilterCostStatus)
    : "ALL";

  const line = firstValue(searchParams.lineId);

  return {
    year,
    month,
    costCenter,
    type: budgetType,
    status,
    lineId: line || null,
  };
}
