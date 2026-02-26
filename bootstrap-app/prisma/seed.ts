import { addMonths } from "date-fns";
import { importBudgetFromExcel } from "../lib/excel-import";
import { saveCostEntry } from "../lib/costs";
import { prisma } from "../lib/prisma";

async function ensureSampleBudget() {
  const existing = await prisma.budgetLine.count();
  if (existing > 0) return;

  try {
    const imported = await importBudgetFromExcel();
    console.log(
      `Importação via Excel concluída: ano ${imported.year} com ${imported.importedLines} linhas.`,
    );
    return;
  } catch {
    console.warn(
      "Pasta2.xlsx não encontrada para seed automático. Criando baseline sintético...",
    );
  }

  const group = await prisma.budgetLine.create({
    data: {
      name: "OPEX TI",
      type: "OPEX",
      isGroup: true,
      source: "MANUAL",
    },
  });

  const line = await prisma.budgetLine.create({
    data: {
      name: "Ferramentas de observabilidade",
      type: "OPEX",
      parentId: group.id,
      isGroup: false,
      source: "MANUAL",
    },
  });

  await prisma.budgetAllocation.createMany({
    data: [
      { year: 2026, budgetLineId: line.id, costCenter: "ENFORCE", amountPlanned: 180000 },
      { year: 2026, budgetLineId: line.id, costCenter: "DA", amountPlanned: 40000 },
      { year: 2026, budgetLineId: line.id, costCenter: "IP", amountPlanned: 30000 },
    ],
  });
}

async function ensureSampleCost() {
  const existing = await prisma.costEntry.count();
  if (existing > 0) return;

  const line = await prisma.budgetLine.findFirst({
    where: { isGroup: false },
    orderBy: { createdAt: "asc" },
  });

  if (!line) return;

  const startDate = new Date(2026, 0, 5);
  const endDate = addMonths(startDate, 11);

  await saveCostEntry({
    title: "Datadog - Observabilidade",
    budgetLineId: line.id,
    type: line.type,
    paymentMode: "MONTHLY",
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    amountPerPeriod: 15000,
    notes: "Seed de exemplo para validar geração automática de 12 parcelas",
    status: "COMMITTED",
    split: { ENFORCE: 70, DA: 20, IP: 10 },
  });
}

async function main() {
  await ensureSampleBudget();
  await ensureSampleCost();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
