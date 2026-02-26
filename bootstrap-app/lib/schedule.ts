import { PaymentMode } from "@prisma/client";
import { addMonths, addYears } from "date-fns";
import { round2 } from "./utils";

type GenerateScheduleInput = {
  paymentMode: PaymentMode;
  amountTotal?: number;
  amountPerPeriod?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  oneOffDate?: Date | null;
};

export type GeneratedSchedule = {
  dueDate: Date;
  amount: number;
};

export type GeneratedCostAmounts = {
  amountTotal: number;
  amountPerPeriod: number | null;
  schedules: GeneratedSchedule[];
};

export function generateSchedules(input: GenerateScheduleInput): GeneratedCostAmounts {
  if (input.paymentMode === "ONE_OFF") {
    if (!input.oneOffDate || !input.amountTotal) {
      throw new Error("ONE_OFF exige data e valor total");
    }
    return {
      amountTotal: round2(input.amountTotal),
      amountPerPeriod: null,
      schedules: [
        {
          dueDate: input.oneOffDate,
          amount: round2(input.amountTotal),
        },
      ],
    };
  }

  if (!input.startDate || !input.endDate || !input.amountPerPeriod) {
    throw new Error("Custos recorrentes exigem startDate, endDate e amountPerPeriod");
  }

  const schedules: GeneratedSchedule[] = [];
  let cursor = new Date(input.startDate);

  while (cursor <= input.endDate) {
    schedules.push({
      dueDate: new Date(cursor),
      amount: round2(input.amountPerPeriod),
    });

    cursor =
      input.paymentMode === "MONTHLY" ? addMonths(cursor, 1) : addYears(cursor, 1);
  }

  return {
    amountPerPeriod: round2(input.amountPerPeriod),
    amountTotal: round2(input.amountPerPeriod * schedules.length),
    schedules,
  };
}
