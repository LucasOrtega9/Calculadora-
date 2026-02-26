import { BudgetLineSource, BudgetType, CostCenter } from "@prisma/client";
import path from "node:path";
import fs from "node:fs";
import * as XLSX from "xlsx";
import { prisma } from "./prisma";
import { COST_CENTERS } from "./constants";

type RawExcelRow = Record<string, unknown>;

function parseNumericCell(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return 0;

  const normalized = value
    .trim()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function findLineColumn(headers: string[]) {
  return (
    headers.find((header) => header.includes("BRL") && header.includes("000")) ??
    headers[0] ??
    "BRL'000"
  );
}

function findYearColumn(headers: string[]) {
  const matched = headers.find((header) => /^(\d{4})-E$/i.test(header.trim()));
  if (!matched) return null;
  const [, year] = matched.match(/^(\d{4})-E$/i) ?? [];
  if (!year) return null;
  return { yearColumn: matched, year: Number(year) };
}

function detectType(lineName: string, current: BudgetType): BudgetType {
  const upper = lineName.toUpperCase();
  if (upper.includes("CAPEX")) return "CAPEX";
  if (upper.includes("OPEX")) return "OPEX";
  return current;
}

function detectIsGroup(name: string, yearValue: number, enforce: number, da: number, ip: number) {
  const hasValues = Math.abs(yearValue) + Math.abs(enforce) + Math.abs(da) + Math.abs(ip) > 0;
  if (!hasValues) return true;
  const upper = name.toUpperCase();
  if (upper.includes("CAPEX") || upper.includes("OPEX")) return true;
  return false;
}

function toBrlFromThousands(value: number) {
  return value * 1000;
}

export function resolveExcelPath(customPath?: string) {
  const candidates = [
    customPath,
    process.env.BUDGET_XLSX_PATH,
    path.resolve(process.cwd(), "Pasta2.xlsx"),
    path.resolve(process.cwd(), "..", "Pasta2.xlsx"),
  ].filter(Boolean) as string[];

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  return found ?? null;
}

function readWorkbook(filePath: string) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames.includes("Planilha1")
    ? "Planilha1"
    : workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("Nenhuma planilha encontrada no arquivo");
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<RawExcelRow>(sheet, { defval: null });
  const headers = Object.keys(rows[0] ?? {});
  const lineColumn = findLineColumn(headers);
  const yearInfo = findYearColumn(headers);

  if (!yearInfo) {
    throw new Error("Não foi possível detectar coluna de ano no formato YYYY-E");
  }

  return {
    rows,
    headers,
    sheetName,
    lineColumn,
    yearColumn: yearInfo.yearColumn,
    year: yearInfo.year,
  };
}

export function getExcelImportPreview(customPath?: string) {
  const filePath = resolveExcelPath(customPath);
  if (!filePath) {
    return {
      found: false,
      filePath: null,
      lineCount: 0,
      detectedYear: null,
      yearColumn: null,
    };
  }

  const workbook = readWorkbook(filePath);
  const nonEmptyRows = workbook.rows.filter((row) => {
    const raw = row[workbook.lineColumn];
    return typeof raw === "string" && raw.trim().length > 0;
  });

  return {
    found: true,
    filePath,
    lineCount: nonEmptyRows.length,
    detectedYear: workbook.year,
    yearColumn: workbook.yearColumn,
  };
}

async function upsertBudgetLine(params: {
  name: string;
  type: BudgetType;
  parentId: string | null;
  isGroup: boolean;
}) {
  const existing = await prisma.budgetLine.findFirst({
    where: {
      name: params.name,
      type: params.type,
      parentId: params.parentId,
    },
  });

  if (existing) {
    return prisma.budgetLine.update({
      where: { id: existing.id },
      data: {
        isGroup: params.isGroup || existing.isGroup,
        source: BudgetLineSource.EXCEL,
        active: true,
      },
    });
  }

  return prisma.budgetLine.create({
    data: {
      name: params.name,
      type: params.type,
      parentId: params.parentId,
      isGroup: params.isGroup,
      source: BudgetLineSource.EXCEL,
      active: true,
    },
  });
}

export async function importBudgetFromExcel(customPath?: string) {
  const filePath = resolveExcelPath(customPath);
  if (!filePath) {
    throw new Error(
      "Arquivo Pasta2.xlsx não encontrado. Coloque em ./Pasta2.xlsx ou defina BUDGET_XLSX_PATH.",
    );
  }

  const workbook = readWorkbook(filePath);
  let currentType: BudgetType = "OPEX";
  const stack: string[] = [];

  let importedLines = 0;
  let allocationUpserts = 0;

  for (const row of workbook.rows) {
    const rawLineName = row[workbook.lineColumn];
    if (typeof rawLineName !== "string") continue;

    const normalizedName = rawLineName.trim();
    if (!normalizedName) continue;

    currentType = detectType(normalizedName, currentType);

    const leadingSpaces = rawLineName.match(/^\s*/)?.[0]?.length ?? 0;
    const level = Math.max(Math.floor(leadingSpaces / 2), 0);
    const parentId = level > 0 ? stack[level - 1] ?? null : null;

    const yearValue = parseNumericCell(row[workbook.yearColumn]);
    const enforceValue = parseNumericCell(row["Enforce"]);
    const daValue = parseNumericCell(row["DA"]);
    const ipValue = parseNumericCell(row["IP"]);

    const isGroup = detectIsGroup(
      normalizedName,
      yearValue,
      enforceValue,
      daValue,
      ipValue,
    );

    const line = await upsertBudgetLine({
      name: normalizedName,
      type: currentType,
      parentId,
      isGroup,
    });

    stack[level] = line.id;
    stack.length = level + 1;
    importedLines += 1;

    const perCenterAmounts: Record<CostCenter, number> = {
      ENFORCE: toBrlFromThousands(enforceValue),
      DA: toBrlFromThousands(daValue),
      IP: toBrlFromThousands(ipValue),
    };

    const allCentersAreZero = COST_CENTERS.every((center) => perCenterAmounts[center] === 0);
    if (allCentersAreZero && yearValue !== 0) {
      perCenterAmounts.ENFORCE = toBrlFromThousands(yearValue);
    }

    for (const center of COST_CENTERS) {
      await prisma.budgetAllocation.upsert({
        where: {
          year_budgetLineId_costCenter: {
            year: workbook.year,
            budgetLineId: line.id,
            costCenter: center,
          },
        },
        update: {
          amountPlanned: perCenterAmounts[center],
        },
        create: {
          year: workbook.year,
          budgetLineId: line.id,
          costCenter: center,
          amountPlanned: perCenterAmounts[center],
        },
      });
      allocationUpserts += 1;
    }
  }

  return {
    filePath,
    sheetName: workbook.sheetName,
    year: workbook.year,
    lineColumn: workbook.lineColumn,
    yearColumn: workbook.yearColumn,
    importedLines,
    allocationUpserts,
  };
}
