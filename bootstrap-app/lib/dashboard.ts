import {
  BudgetType,
  type Prisma,
  ScheduleStatus,
} from "@prisma/client";
import {
  endOfMonth,
  endOfYear,
  isAfter,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { MONTH_NAMES_PT } from "./constants";
import { type DashboardFilters } from "./filters";
import { prisma } from "./prisma";
import { resolveSplitPercent } from "./costs";
import { decimalToNumber, round2 } from "./utils";

type RawBudgetLine = {
  id: string;
  name: string;
  type: BudgetType;
  parentId: string | null;
  isGroup: boolean;
};

export type LineMetric = {
  plannedAnnual: number;
  plannedYtd: number;
  realizedYtd: number;
  committedYtd: number;
};

export type BudgetTreeNode = {
  id: string;
  name: string;
  type: BudgetType;
  isGroup: boolean;
  depth: number;
  metrics: LineMetric & {
    consumedYtd: number;
    balance: number;
    delta: number;
  };
  children: BudgetTreeNode[];
};

export type DashboardData = {
  year: number;
  ytdEndDate: Date;
  totals: {
    plannedYtd: number;
    realizedYtd: number;
    committedYtd: number;
    balance: number;
    commitmentPercent: number;
  };
  momData: Array<{ month: string; planned: number; realized: number }>;
  ytdData: Array<{ month: string; plannedAcc: number; realizedAcc: number }>;
  tree: BudgetTreeNode[];
  availableYears: number[];
  availableLines: Array<{ id: string; name: string; type: BudgetType }>;
};

type MetricAccumulator = {
  plannedAnnual: number;
  plannedYtd: number;
  realizedYtd: number;
  committedYtd: number;
  realizedMonthly: number[];
  plannedMonthly: number[];
};

function getYtdEndDate(year: number, month: number | null) {
  if (month) {
    return endOfMonth(new Date(year, month - 1, 1));
  }

  const now = new Date();
  if (year === now.getFullYear()) return now;
  return endOfYear(new Date(year, 0, 1));
}

function flattenDescendants(rootId: string, childrenByParent: Map<string, string[]>) {
  const ids = [rootId];
  const stack = [...(childrenByParent.get(rootId) ?? [])];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    ids.push(current);
    const children = childrenByParent.get(current);
    if (children) stack.push(...children);
  }

  return ids;
}

function emptyAccumulator(): MetricAccumulator {
  return {
    plannedAnnual: 0,
    plannedYtd: 0,
    realizedYtd: 0,
    committedYtd: 0,
    realizedMonthly: new Array(12).fill(0),
    plannedMonthly: new Array(12).fill(0),
  };
}

function toTree(
  id: string,
  depth: number,
  linesById: Map<string, RawBudgetLine>,
  childrenByParent: Map<string, string[]>,
  metricsMap: Map<string, MetricAccumulator>,
): BudgetTreeNode {
  const line = linesById.get(id);
  if (!line) {
    throw new Error("Linha não encontrada");
  }

  const children = (childrenByParent.get(id) ?? []).map((childId) =>
    toTree(childId, depth + 1, linesById, childrenByParent, metricsMap),
  );

  const current = metricsMap.get(id) ?? emptyAccumulator();
  const consumedYtd = round2(current.realizedYtd + current.committedYtd);
  const balance = round2(current.plannedYtd - consumedYtd);
  const delta = round2(current.realizedYtd - current.plannedYtd);

  return {
    id,
    name: line.name,
    type: line.type,
    isGroup: line.isGroup,
    depth,
    metrics: {
      plannedAnnual: round2(current.plannedAnnual),
      plannedYtd: round2(current.plannedYtd),
      realizedYtd: round2(current.realizedYtd),
      committedYtd: round2(current.committedYtd),
      consumedYtd,
      balance,
      delta,
    },
    children,
  };
}

export async function getAvailableYears() {
  const grouped = await prisma.budgetAllocation.groupBy({
    by: ["year"],
    orderBy: { year: "asc" },
  });
  return grouped.map((item) => item.year);
}

export async function getDashboardData(filters: DashboardFilters): Promise<DashboardData> {
  const yearStart = startOfYear(new Date(filters.year, 0, 1));
  const yearEnd = endOfYear(yearStart);
  const ytdEndDate = getYtdEndDate(filters.year, filters.month);
  const monthsInYtd = ytdEndDate.getMonth() + 1;
  const today = startOfDay(new Date());
  const commitmentStart = isAfter(today, yearStart) ? today : yearStart;

  const lineWhere: Prisma.BudgetLineWhereInput = {
    active: true,
    ...(filters.type !== "ALL" ? { type: filters.type } : {}),
  };

  const lines = await prisma.budgetLine.findMany({
    where: lineWhere,
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  const childrenByParent = new Map<string, string[]>();
  const linesById = new Map<string, RawBudgetLine>();
  const rootLines: string[] = [];

  for (const line of lines) {
    linesById.set(line.id, {
      id: line.id,
      name: line.name,
      type: line.type,
      parentId: line.parentId,
      isGroup: line.isGroup,
    });

    if (!line.parentId) {
      rootLines.push(line.id);
      continue;
    }

    const siblings = childrenByParent.get(line.parentId) ?? [];
    siblings.push(line.id);
    childrenByParent.set(line.parentId, siblings);
  }

  const scopedLineIds = filters.lineId
    ? flattenDescendants(filters.lineId, childrenByParent)
    : lines.map((line) => line.id);

  const allocationCenterWhere =
    filters.costCenter === "ALL" ? {} : { costCenter: filters.costCenter };

  const allocations = await prisma.budgetAllocation.findMany({
    where: {
      year: filters.year,
      budgetLineId: { in: scopedLineIds },
      ...allocationCenterWhere,
    },
  });

  const schedules = await prisma.paymentSchedule.findMany({
    where: {
      dueDate: {
        gte: startOfMonth(yearStart),
        lte: yearEnd,
      },
      status: {
        in: [ScheduleStatus.SCHEDULED, ScheduleStatus.PAID],
      },
      costEntry: {
        ...(filters.type !== "ALL" ? { type: filters.type } : {}),
        ...(filters.status !== "ALL" ? { status: filters.status } : {}),
        budgetLineId: { in: scopedLineIds },
      },
    },
    include: {
      costEntry: {
        select: {
          budgetLineId: true,
          splits: true,
        },
      },
    },
  });

  const metricsMap = new Map<string, MetricAccumulator>();
  const getMetric = (lineId: string) => {
    const existing = metricsMap.get(lineId);
    if (existing) return existing;
    const created = emptyAccumulator();
    metricsMap.set(lineId, created);
    return created;
  };

  for (const allocation of allocations) {
    const metric = getMetric(allocation.budgetLineId);
    const annual = decimalToNumber(allocation.amountPlanned);
    metric.plannedAnnual += annual;
    metric.plannedYtd += (annual / 12) * monthsInYtd;
    for (let i = 0; i < 12; i += 1) {
      metric.plannedMonthly[i] += annual / 12;
    }
  }

  const monthlyRealized = new Array(12).fill(0);
  const monthlyPlanned = new Array(12).fill(0);

  for (const schedule of schedules) {
    const monthIndex = schedule.dueDate.getMonth();
    const splitFactor = resolveSplitPercent(schedule.costEntry.splits, filters.costCenter);
    const splitAmount = decimalToNumber(schedule.amount) * splitFactor;
    const metric = getMetric(schedule.costEntry.budgetLineId);

    if (schedule.status === ScheduleStatus.PAID && schedule.dueDate <= ytdEndDate) {
      metric.realizedYtd += splitAmount;
      metric.realizedMonthly[monthIndex] += splitAmount;
      monthlyRealized[monthIndex] += splitAmount;
    }

    if (
      schedule.status === ScheduleStatus.SCHEDULED &&
      schedule.dueDate >= commitmentStart &&
      schedule.dueDate <= ytdEndDate
    ) {
      metric.committedYtd += splitAmount;
    }
  }

  for (const [, metric] of metricsMap) {
    for (let i = 0; i < 12; i += 1) {
      monthlyPlanned[i] += metric.plannedMonthly[i];
    }
  }

  function aggregate(id: string): MetricAccumulator {
    const own = metricsMap.get(id) ?? emptyAccumulator();
    const children = childrenByParent.get(id) ?? [];

    for (const childId of children) {
      const child = aggregate(childId);
      own.plannedAnnual += child.plannedAnnual;
      own.plannedYtd += child.plannedYtd;
      own.realizedYtd += child.realizedYtd;
      own.committedYtd += child.committedYtd;
      for (let i = 0; i < 12; i += 1) {
        own.realizedMonthly[i] += child.realizedMonthly[i];
        own.plannedMonthly[i] += child.plannedMonthly[i];
      }
    }

    metricsMap.set(id, own);
    return own;
  }

  const roots = filters.lineId ? [filters.lineId] : rootLines;
  const existingRoots = roots.filter((id) => linesById.has(id));
  for (const rootId of existingRoots) {
    aggregate(rootId);
  }

  const tree = existingRoots.map((rootId) =>
    toTree(rootId, 0, linesById, childrenByParent, metricsMap),
  );

  const totals = tree.reduce(
    (acc, node) => {
      acc.planned += node.metrics.plannedYtd;
      acc.realized += node.metrics.realizedYtd;
      acc.committed += node.metrics.committedYtd;
      return acc;
    },
    { planned: 0, realized: 0, committed: 0 },
  );

  const consumed = totals.realized + totals.committed;
  const balance = totals.planned - consumed;
  const commitmentPercent = totals.planned > 0 ? Math.min((consumed / totals.planned) * 100, 100) : 0;

  let plannedAcc = 0;
  let realizedAcc = 0;
  const momData = MONTH_NAMES_PT.map((month, index) => ({
    month,
    planned: round2(monthlyPlanned[index]),
    realized: round2(monthlyRealized[index]),
  }));
  const ytdData = MONTH_NAMES_PT.map((month, index) => {
    plannedAcc += monthlyPlanned[index];
    realizedAcc += monthlyRealized[index];
    return {
      month,
      plannedAcc: round2(plannedAcc),
      realizedAcc: round2(realizedAcc),
    };
  });

  const years = await getAvailableYears();

  return {
    year: filters.year,
    ytdEndDate,
    totals: {
      plannedYtd: round2(totals.planned),
      realizedYtd: round2(totals.realized),
      committedYtd: round2(totals.committed),
      balance: round2(balance),
      commitmentPercent: round2(commitmentPercent),
    },
    momData,
    ytdData,
    tree,
    availableYears: years,
    availableLines: lines.map((line) => ({
      id: line.id,
      name: line.name,
      type: line.type,
    })),
  };
}
