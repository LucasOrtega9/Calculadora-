import { BudgetType, CostCenter, CostStatus, PaymentMode } from "@prisma/client";

export const COST_CENTERS: CostCenter[] = ["ENFORCE", "DA", "IP"];

export const COST_CENTER_LABEL: Record<CostCenter, string> = {
  ENFORCE: "Enforce",
  DA: "DA",
  IP: "IP",
};

export const BUDGET_TYPES: BudgetType[] = ["OPEX", "CAPEX"];

export const BUDGET_TYPE_LABEL: Record<BudgetType, string> = {
  OPEX: "OPEX",
  CAPEX: "CAPEX",
};

export const COST_STATUSES: CostStatus[] = [
  "PLANNED",
  "COMMITTED",
  "PAID",
  "CANCELLED",
];

export const COST_STATUS_LABEL: Record<CostStatus, string> = {
  PLANNED: "Planejado",
  COMMITTED: "Comprometido",
  PAID: "Pago",
  CANCELLED: "Cancelado",
};

export const PAYMENT_MODE_LABEL: Record<PaymentMode, string> = {
  ONE_OFF: "Pontual",
  MONTHLY: "Mensal",
  ANNUAL: "Anual",
};

export const MONTH_NAMES_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
