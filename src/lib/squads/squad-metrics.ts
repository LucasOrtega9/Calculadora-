import type { Horizon, Quarter, StrategicAlignment } from "@/types/enums";
import type { Initiative } from "@/types/initiative";

export type SquadDistributionRow = {
  label: string;
  hours: number;
  percentage: number;
};

export type SquadQuarterBucket = {
  year: number;
  quarter: Quarter;
  initiatives: Initiative[];
  totalHours: number;
  totalCost: number;
};

export type SquadMetrics = {
  squadName: string;
  items: Initiative[];
  totalInitiatives: number;
  totalHours: number;
  totalCost: number;
  mainOwners: string[];
  byWorkType: SquadDistributionRow[];
  byBusinessArea: SquadDistributionRow[];
  byStrategicGoal: SquadDistributionRow[];
  horizonCount: Record<Horizon, number>;
  horizonHours: Record<Horizon, number>;
  byQuarter: SquadQuarterBucket[];
  alerts: {
    messages: string[];
    runEffortPercent: number;
    highAlignmentEffortPercent: number;
    shortHorizonEffortPercent: number;
    criticalAndHighEffortPercent: number;
    insight: string;
  };
  highAlignmentEffortPercent: number;
  runEffortPercent: number;
  criticalAndHighEffortPercent: number;
  shortTermEffortPercent: number;
};

function toPercent(part: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return (part / total) * 100;
}

function buildDistribution(
  initiatives: Initiative[],
  selector: (item: Initiative) => string,
): SquadDistributionRow[] {
  const totalHours = initiatives.reduce((acc, item) => acc + item.estimated_hours, 0);
  const map = new Map<string, number>();

  for (const item of initiatives) {
    const key = selector(item);
    map.set(key, (map.get(key) ?? 0) + item.estimated_hours);
  }

  return Array.from(map.entries())
    .map(([label, hours]) => ({
      label,
      hours,
      percentage: toPercent(hours, totalHours),
    }))
    .sort((a, b) => b.hours - a.hours);
}

function buildQuarterBuckets(initiatives: Initiative[]): SquadQuarterBucket[] {
  const quarterOrder: Record<Quarter, number> = {
    Q1: 1,
    Q2: 2,
    Q3: 3,
    Q4: 4,
  };
  const horizonOrder: Record<Horizon, number> = {
    curto: 1,
    medio: 2,
    longo: 3,
  };
  const map = new Map<string, SquadQuarterBucket>();

  for (const item of initiatives) {
    const key = `${item.year}-${item.quarter}`;
    const current = map.get(key) ?? {
      year: item.year,
      quarter: item.quarter,
      initiatives: [],
      totalHours: 0,
      totalCost: 0,
    };

    current.initiatives.push(item);
    current.totalHours += item.estimated_hours;
    current.totalCost += item.total_cost;
    map.set(key, current);
  }

  return Array.from(map.values())
    .map((bucket) => ({
      ...bucket,
      initiatives: [...bucket.initiatives].sort((a, b) => {
        if (horizonOrder[a.horizon] !== horizonOrder[b.horizon]) {
          return horizonOrder[a.horizon] - horizonOrder[b.horizon];
        }
        return String(a.start_date).localeCompare(String(b.start_date));
      }),
    }))
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return quarterOrder[a.quarter] - quarterOrder[b.quarter];
    });
}

function buildSquadAlerts(
  runEffortPercent: number,
  highAlignmentEffortPercent: number,
  shortTermEffortPercent: number,
  criticalAndHighEffortPercent: number,
): { messages: string[]; insight: string } {
  const messages: string[] = [];

  if (runEffortPercent >= 45) {
    messages.push("Excesso de run reduz capacidade de evolucao estrutural.");
  }

  if (highAlignmentEffortPercent < 50) {
    messages.push("Baixo alinhamento estrategico alto no esforco total do squad.");
  }

  if (shortTermEffortPercent > 65) {
    messages.push("Concentracao excessiva no curto prazo pode pressionar continuidade.");
  }

  if (criticalAndHighEffortPercent < 60) {
    messages.push("Baixa cobertura de prioridades critica/alta no planejamento.");
  }

  const insight =
    messages.length > 0
      ? "Reforcar balanceamento entre prioridades e transformacao para reduzir risco de execucao."
      : "Squad com perfil de execucao equilibrado no momento.";

  if (messages.length === 0) {
    messages.push("Sem alertas criticos no momento para este squad.");
  }

  return { messages, insight };
}

function computeSquadMetrics(squadName: string, items: Initiative[]): SquadMetrics {
  const totalInitiatives = items.length;
  const totalHours = items.reduce((acc, item) => acc + item.estimated_hours, 0);
  const totalCost = items.reduce((acc, item) => acc + item.total_cost, 0);
  const mainOwners = Array.from(new Set(items.map((item) => item.owner)))
    .sort()
    .slice(0, 3);

  const horizonCount: Record<Horizon, number> = { curto: 0, medio: 0, longo: 0 };
  const horizonHours: Record<Horizon, number> = { curto: 0, medio: 0, longo: 0 };
  const alignmentHours: Record<StrategicAlignment, number> = {
    alto: 0,
    medio: 0,
    baixo: 0,
  };

  let runHours = 0;
  let criticalAndHighHours = 0;

  for (const item of items) {
    horizonCount[item.horizon] += 1;
    horizonHours[item.horizon] += item.estimated_hours;
    alignmentHours[item.strategic_alignment] += item.estimated_hours;

    if (item.work_type === "run") {
      runHours += item.estimated_hours;
    }

    if (item.prioridade === "critica" || item.prioridade === "alta") {
      criticalAndHighHours += item.estimated_hours;
    }
  }

  const highAlignmentEffortPercent = toPercent(alignmentHours.alto, totalHours);
  const runEffortPercent = toPercent(runHours, totalHours);
  const criticalAndHighEffortPercent = toPercent(criticalAndHighHours, totalHours);
  const shortTermEffortPercent = toPercent(horizonHours.curto, totalHours);

  const squadAlerts = buildSquadAlerts(
    runEffortPercent,
    highAlignmentEffortPercent,
    shortTermEffortPercent,
    criticalAndHighEffortPercent,
  );

  return {
    squadName,
    items,
    totalInitiatives,
    totalHours,
    totalCost,
    mainOwners,
    byWorkType: buildDistribution(items, (item) => item.work_type.toUpperCase()),
    byBusinessArea: buildDistribution(items, (item) => item.business_area),
    byStrategicGoal: buildDistribution(items, (item) => item.strategic_goal),
    horizonCount,
    horizonHours,
    byQuarter: buildQuarterBuckets(items),
    alerts: {
      messages: squadAlerts.messages,
      runEffortPercent,
      highAlignmentEffortPercent,
      shortHorizonEffortPercent: shortTermEffortPercent,
      criticalAndHighEffortPercent,
      insight: squadAlerts.insight,
    },
    highAlignmentEffortPercent,
    runEffortPercent,
    criticalAndHighEffortPercent,
    shortTermEffortPercent,
  };
}

export function groupInitiativesBySquad(initiatives: Initiative[]): SquadMetrics[] {
  const map = new Map<string, Initiative[]>();

  for (const item of initiatives) {
    const current = map.get(item.squad) ?? [];
    current.push(item);
    map.set(item.squad, current);
  }

  return Array.from(map.entries())
    .map(([squadName, items]) => computeSquadMetrics(squadName, items))
    .sort((a, b) => b.totalHours - a.totalHours);
}
