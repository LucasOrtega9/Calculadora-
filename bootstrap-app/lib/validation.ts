import { PaymentMode } from "@prisma/client";
import { z } from "zod";
import { round2 } from "./utils";

export const splitSchema = z.object({
  ENFORCE: z.coerce.number().min(0).max(100),
  DA: z.coerce.number().min(0).max(100),
  IP: z.coerce.number().min(0).max(100),
});

export const costEntrySchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(3, "Título é obrigatório"),
    vendor: z.string().optional(),
    budgetLineId: z.string().min(1, "Linha de orçamento é obrigatória"),
    type: z.enum(["OPEX", "CAPEX"]),
    paymentMode: z.enum(["ONE_OFF", "MONTHLY", "ANNUAL"]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    oneOffDate: z.string().optional(),
    amountTotal: z.coerce.number().optional(),
    amountPerPeriod: z.coerce.number().optional(),
    notes: z.string().optional(),
    status: z.enum(["PLANNED", "COMMITTED", "PAID", "CANCELLED"]).default("COMMITTED"),
    split: splitSchema,
  })
  .superRefine((data, ctx) => {
    const splitTotal = round2(data.split.ENFORCE + data.split.DA + data.split.IP);
    if (Math.abs(splitTotal - 100) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["split"],
        message: `Rateio deve somar 100%. Atual: ${splitTotal.toFixed(2)}%`,
      });
    }

    if (data.paymentMode === PaymentMode.ONE_OFF) {
      if (!data.oneOffDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["oneOffDate"],
          message: "Data do pagamento é obrigatória para custo pontual",
        });
      }
      if (!data.amountTotal || data.amountTotal <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["amountTotal"],
          message: "Valor total deve ser maior que zero",
        });
      }
      return;
    }

    if (!data.startDate || !data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Data de início e fim são obrigatórias para custos recorrentes",
      });
    }

    const start = data.startDate ? new Date(data.startDate) : null;
    const end = data.endDate ? new Date(data.endDate) : null;
    if (start && end && end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Data de fim deve ser maior ou igual à data de início",
      });
    }

    if (!data.amountPerPeriod || data.amountPerPeriod <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amountPerPeriod"],
        message: "Valor por período deve ser maior que zero",
      });
    }
  });

export function parseFormDataToCostPayload(formData: FormData) {
  return costEntrySchema.parse({
    id: formData.get("id")?.toString(),
    title: formData.get("title")?.toString(),
    vendor: formData.get("vendor")?.toString(),
    budgetLineId: formData.get("budgetLineId")?.toString(),
    type: formData.get("type")?.toString(),
    paymentMode: formData.get("paymentMode")?.toString(),
    startDate: formData.get("startDate")?.toString(),
    endDate: formData.get("endDate")?.toString(),
    oneOffDate: formData.get("oneOffDate")?.toString(),
    amountTotal: formData.get("amountTotal")?.toString(),
    amountPerPeriod: formData.get("amountPerPeriod")?.toString(),
    notes: formData.get("notes")?.toString(),
    status: formData.get("status")?.toString() || "COMMITTED",
    split: {
      ENFORCE: formData.get("splitEnforce")?.toString() || "100",
      DA: formData.get("splitDa")?.toString() || "0",
      IP: formData.get("splitIp")?.toString() || "0",
    },
  });
}

export type CostEntryInput = z.infer<typeof costEntrySchema>;

export const budgetLineSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  type: z.enum(["OPEX", "CAPEX"]),
  parentId: z.string().optional(),
  isGroup: z.coerce.boolean().default(false),
});

export const importPathSchema = z.object({
  path: z.string().min(1),
});
