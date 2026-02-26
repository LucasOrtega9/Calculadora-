import {
  CostCenter,
  CostStatus,
  PaymentMode,
  ScheduleStatus,
  type Prisma,
} from "@prisma/client";
import { endOfYear, format, isBefore, startOfDay, startOfYear } from "date-fns";
import { prisma } from "./prisma";
import { type CostEntryInput } from "./validation";
import { generateSchedules } from "./schedule";
import { decimalToNumber, round2 } from "./utils";

export function resolveSplitPercent(
  splits: Array<{ costCenter: CostCenter; percent: Prisma.Decimal }>,
  center: CostCenter | "ALL",
) {
  if (center === "ALL") return 1;

  if (splits.length === 0) {
    return center === "ENFORCE" ? 1 : 0;
  }

  const found = splits.find((split) => split.costCenter === center);
  return found ? decimalToNumber(found.percent) / 100 : 0;
}

function toNullableString(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function saveCostEntry(payload: CostEntryInput) {
  const amountData = generateSchedules({
    paymentMode: payload.paymentMode,
    amountTotal: payload.amountTotal,
    amountPerPeriod: payload.amountPerPeriod,
    startDate: payload.startDate ? new Date(payload.startDate) : null,
    endDate: payload.endDate ? new Date(payload.endDate) : null,
    oneOffDate: payload.oneOffDate ? new Date(payload.oneOffDate) : null,
  });

  const scheduleStatus: ScheduleStatus =
    payload.status === "CANCELLED" ? "CANCELLED" : "SCHEDULED";

  const data: Prisma.CostEntryUncheckedCreateInput = {
    title: payload.title.trim(),
    vendor: toNullableString(payload.vendor),
    budgetLineId: payload.budgetLineId,
    type: payload.type,
    paymentMode: payload.paymentMode,
    startDate: payload.startDate ? new Date(payload.startDate) : null,
    endDate: payload.endDate ? new Date(payload.endDate) : null,
    oneOffDate: payload.oneOffDate ? new Date(payload.oneOffDate) : null,
    amountTotal: amountData.amountTotal,
    amountPerPeriod: amountData.amountPerPeriod,
    notes: toNullableString(payload.notes),
    status: payload.status,
  };

  const splits = [
    { costCenter: "ENFORCE" as const, percent: round2(payload.split.ENFORCE) },
    { costCenter: "DA" as const, percent: round2(payload.split.DA) },
    { costCenter: "IP" as const, percent: round2(payload.split.IP) },
  ];

  const schedules = amountData.schedules.map((schedule) => ({
    dueDate: schedule.dueDate,
    amount: schedule.amount,
    status: scheduleStatus,
  }));

  if (payload.id) {
    const updated = await prisma.costEntry.update({
      where: { id: payload.id },
      data: {
        ...data,
        splits: {
          deleteMany: {},
          create: splits,
        },
        schedules: {
          deleteMany: {},
          create: schedules,
        },
      },
    });
    return updated.id;
  }

  const created = await prisma.costEntry.create({
    data: {
      ...data,
      splits: {
        create: splits,
      },
      schedules: {
        create: schedules,
      },
    },
  });

  return created.id;
}

export async function duplicateCostEntry(id: string) {
  const original = await prisma.costEntry.findUnique({
    where: { id },
    include: {
      splits: true,
      schedules: true,
    },
  });

  if (!original) {
    throw new Error("Custo não encontrado");
  }

  const copied = await prisma.costEntry.create({
    data: {
      title: `${original.title} (Cópia)`,
      vendor: original.vendor,
      budgetLineId: original.budgetLineId,
      type: original.type,
      paymentMode: original.paymentMode,
      startDate: original.startDate,
      endDate: original.endDate,
      oneOffDate: original.oneOffDate,
      amountTotal: original.amountTotal,
      amountPerPeriod: original.amountPerPeriod,
      notes: original.notes,
      status: "PLANNED",
      splits: {
        create: original.splits.map((split) => ({
          costCenter: split.costCenter,
          percent: split.percent,
        })),
      },
      schedules: {
        create: original.schedules.map((schedule) => ({
          dueDate: schedule.dueDate,
          amount: schedule.amount,
          status: "SCHEDULED",
        })),
      },
    },
  });

  return copied.id;
}

export async function cancelCostEntry(id: string) {
  await prisma.costEntry.update({
    where: { id },
    data: {
      status: "CANCELLED",
      schedules: {
        updateMany: {
          where: {
            status: { not: "PAID" },
          },
          data: {
            status: "CANCELLED",
          },
        },
      },
    },
  });
}

export async function markScheduleAsPaid(
  scheduleId: string,
  paid: boolean,
  paidAt?: Date | null,
) {
  const update = await prisma.paymentSchedule.update({
    where: { id: scheduleId },
    data: {
      status: paid ? "PAID" : "SCHEDULED",
      paidAt: paid ? paidAt ?? new Date() : null,
    },
    include: {
      costEntry: {
        include: {
          schedules: true,
        },
      },
    },
  });

  const schedules = update.costEntry.schedules;
  const hasScheduled = schedules.some((schedule) => schedule.status === "SCHEDULED");
  const allPaidOrCancelled = schedules.every(
    (schedule) => schedule.status === "PAID" || schedule.status === "CANCELLED",
  );

  let nextStatus: CostStatus = update.costEntry.status;
  if (allPaidOrCancelled) {
    nextStatus = "PAID";
  } else if (hasScheduled) {
    nextStatus = "COMMITTED";
  }

  if (nextStatus !== update.costEntry.status) {
    await prisma.costEntry.update({
      where: { id: update.costEntryId },
      data: { status: nextStatus },
    });
  }
}

export function formatPeriodLabel(params: {
  paymentMode: PaymentMode;
  startDate: Date | null;
  endDate: Date | null;
  oneOffDate: Date | null;
}) {
  if (params.paymentMode === "ONE_OFF") {
    return params.oneOffDate ? format(params.oneOffDate, "dd/MM/yyyy") : "-";
  }

  const from = params.startDate ? format(params.startDate, "MM/yyyy") : "-";
  const to = params.endDate ? format(params.endDate, "MM/yyyy") : "-";
  return `${from} até ${to}`;
}

export async function listCosts(params: {
  year: number;
  type: "ALL" | "OPEX" | "CAPEX";
  status: "ALL" | "PLANNED" | "COMMITTED" | "PAID" | "CANCELLED";
  search: string;
  costCenter: CostCenter | "ALL";
}) {
  const yearStart = startOfYear(new Date(params.year, 0, 1));
  const yearEnd = endOfYear(yearStart);
  const today = startOfDay(new Date());

  const costs = await prisma.costEntry.findMany({
    where: {
      ...(params.type !== "ALL" ? { type: params.type } : {}),
      ...(params.status !== "ALL" ? { status: params.status } : {}),
      ...(params.search
        ? {
            OR: [
              { title: { contains: params.search } },
              { vendor: { contains: params.search } },
            ],
          }
        : {}),
    },
    include: {
      budgetLine: true,
      splits: true,
      schedules: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return costs.map((cost) => {
    let realized = 0;
    let committed = 0;
    const splitFactor = resolveSplitPercent(cost.splits, params.costCenter);

    for (const schedule of cost.schedules) {
      if (isBefore(schedule.dueDate, yearStart) || schedule.dueDate > yearEnd) continue;

      const amount = decimalToNumber(schedule.amount) * splitFactor;
      if (schedule.status === "PAID") realized += amount;

      if (schedule.status === "SCHEDULED" && !isBefore(schedule.dueDate, today)) {
        committed += amount;
      }
    }

    return {
      ...cost,
      amountTotalNumber: decimalToNumber(cost.amountTotal),
      realized: round2(realized),
      committed: round2(committed),
      periodLabel: formatPeriodLabel({
        paymentMode: cost.paymentMode,
        startDate: cost.startDate,
        endDate: cost.endDate,
        oneOffDate: cost.oneOffDate,
      }),
    };
  });
}
