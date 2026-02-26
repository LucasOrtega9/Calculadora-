"use server";

import { BudgetLineSource } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { cancelCostEntry, duplicateCostEntry, markScheduleAsPaid, saveCostEntry } from "@/lib/costs";
import { importBudgetFromExcel } from "@/lib/excel-import";
import { prisma } from "@/lib/prisma";
import { budgetLineSchema, parseFormDataToCostPayload } from "@/lib/validation";

export async function saveCostEntryAction(formData: FormData) {
  const returnTo = formData.get("returnTo")?.toString() || "/costs/new";
  try {
    const payload = parseFormDataToCostPayload(formData);
    const id = await saveCostEntry(payload);

    revalidatePath("/");
    revalidatePath("/costs");
    revalidatePath(`/costs/${id}`);
    redirect(`/costs/${id}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao salvar custo";
    redirect(`${returnTo}?error=${encodeURIComponent(message)}`);
  }
}

export async function toggleSchedulePaidAction(formData: FormData) {
  const scheduleId = formData.get("scheduleId")?.toString();
  const costEntryId = formData.get("costEntryId")?.toString();
  const paid = formData.get("paid")?.toString() === "true";
  const paidAt = formData.get("paidAt")?.toString();

  if (!scheduleId || !costEntryId) {
    redirect("/costs");
  }

  await markScheduleAsPaid(scheduleId, paid, paidAt ? new Date(paidAt) : new Date());
  revalidatePath("/");
  revalidatePath("/costs");
  revalidatePath(`/costs/${costEntryId}`);
  redirect(`/costs/${costEntryId}`);
}

export async function duplicateCostEntryAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) redirect("/costs");

  const copiedId = await duplicateCostEntry(id);
  revalidatePath("/costs");
  redirect(`/costs/${copiedId}`);
}

export async function cancelCostEntryAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) redirect("/costs");

  await cancelCostEntry(id);
  revalidatePath("/");
  revalidatePath("/costs");
  revalidatePath(`/costs/${id}`);
  redirect(`/costs/${id}`);
}

export async function importBudgetAction(formData: FormData) {
  const pathInput = formData.get("path")?.toString() || undefined;
  const result = await importBudgetFromExcel(pathInput);
  revalidatePath("/");
  revalidatePath("/import");
  revalidatePath("/costs/new");

  redirect(
    `/import?imported=1&year=${result.year}&lines=${result.importedLines}&allocations=${result.allocationUpserts}`,
  );
}

const createManualLineSchema = budgetLineSchema.extend({
  amountEnforce: z.coerce.number().min(0).default(0),
  amountDa: z.coerce.number().min(0).default(0),
  amountIp: z.coerce.number().min(0).default(0),
  year: z.coerce.number().int().min(2000).max(2100),
});

export async function createManualBudgetLineAction(formData: FormData) {
  const payload = createManualLineSchema.parse({
    name: formData.get("name")?.toString(),
    type: formData.get("type")?.toString(),
    parentId: formData.get("parentId")?.toString() || undefined,
    isGroup: formData.get("isGroup")?.toString() === "true",
    amountEnforce: formData.get("amountEnforce")?.toString() || "0",
    amountDa: formData.get("amountDa")?.toString() || "0",
    amountIp: formData.get("amountIp")?.toString() || "0",
    year: formData.get("year")?.toString(),
  });

  const created = await prisma.budgetLine.create({
    data: {
      name: payload.name,
      type: payload.type,
      parentId: payload.parentId || null,
      isGroup: payload.isGroup,
      source: BudgetLineSource.MANUAL,
    },
  });

  await prisma.budgetAllocation.createMany({
    data: [
      {
        budgetLineId: created.id,
        year: payload.year,
        costCenter: "ENFORCE",
        amountPlanned: payload.amountEnforce,
      },
      {
        budgetLineId: created.id,
        year: payload.year,
        costCenter: "DA",
        amountPlanned: payload.amountDa,
      },
      {
        budgetLineId: created.id,
        year: payload.year,
        costCenter: "IP",
        amountPlanned: payload.amountIp,
      },
    ],
  });

  revalidatePath("/");
  revalidatePath("/import");
  redirect("/import?manual=1");
}
