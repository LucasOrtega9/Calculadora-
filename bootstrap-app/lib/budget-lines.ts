import { BudgetType } from "@prisma/client";
import { prisma } from "./prisma";

export type BudgetLineOption = {
  id: string;
  name: string;
  type: BudgetType;
  depth: number;
};

export async function getBudgetLineOptions(filterType: BudgetType | "ALL" = "ALL") {
  const lines = await prisma.budgetLine.findMany({
    where: {
      active: true,
      ...(filterType !== "ALL" ? { type: filterType } : {}),
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  const byParent = new Map<string | null, typeof lines>();
  for (const line of lines) {
    const list = byParent.get(line.parentId) ?? [];
    list.push(line);
    byParent.set(line.parentId, list);
  }

  const sortedChildren = (items: typeof lines) =>
    [...items].sort((a, b) => a.name.localeCompare(b.name));

  const result: BudgetLineOption[] = [];

  const walk = (parentId: string | null, depth: number) => {
    const children = byParent.get(parentId);
    if (!children) return;
    for (const child of sortedChildren(children)) {
      result.push({
        id: child.id,
        name: child.name,
        type: child.type,
        depth,
      });
      walk(child.id, depth + 1);
    }
  };

  walk(null, 0);
  return result;
}

export async function getBudgetYears() {
  const years = await prisma.budgetAllocation.groupBy({
    by: ["year"],
    orderBy: { year: "asc" },
  });
  return years.map((item) => item.year);
}

export async function getBudgetLineById(id: string) {
  return prisma.budgetLine.findUnique({
    where: { id },
  });
}

export function parseCostsFilters(searchParams: Record<string, string | string[] | undefined>) {
  const currentYear = new Date().getFullYear();
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const yearRaw = Number(first(searchParams.year) ?? currentYear);
  const year = Number.isFinite(yearRaw) ? yearRaw : currentYear;
  const typeRaw = first(searchParams.type);
  const statusRaw = first(searchParams.status);
  const centerRaw = first(searchParams.costCenter);
  const searchRaw = first(searchParams.search) ?? "";

  return {
    year,
    type: (typeRaw === "OPEX" || typeRaw === "CAPEX" ? typeRaw : "ALL") as
      | "ALL"
      | "OPEX"
      | "CAPEX",
    status: (
      statusRaw === "PLANNED" ||
      statusRaw === "COMMITTED" ||
      statusRaw === "PAID" ||
      statusRaw === "CANCELLED"
        ? statusRaw
        : "ALL"
    ) as "ALL" | "PLANNED" | "COMMITTED" | "PAID" | "CANCELLED",
    costCenter: (
      centerRaw === "ENFORCE" || centerRaw === "DA" || centerRaw === "IP"
        ? centerRaw
        : "ALL"
    ) as "ALL" | "ENFORCE" | "DA" | "IP",
    search: searchRaw,
  };
}
