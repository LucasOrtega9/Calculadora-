import type {
  Horizon,
  Prioridade,
  Quarter,
  StrategicAlignment,
  StrategicGoal,
  WorkType,
} from "@/types/enums";
import type { Initiative } from "@/types/initiative";

type DistributionKey =
  | WorkType
  | StrategicGoal
  | Prioridade
  | StrategicAlignment
  | Horizon
  | string;

export type DistributionRow = {
  key: DistributionKey;
  initiatives: number;
  hours: number;
  percentage: number;
};

export type QuarterBucket = {
  year: number;
  quarter: Quarter;
  initiatives: Initiative[];
};

export type ExecutiveDashboardMetrics = {
  summary: {
    totalInitiatives: number;
    totalHours: number;
    totalCost: number;
    averageCostPerInitiative: number;
    alignmentByInitiatives: DistributionRow[];
  };
  effortAllocation: {
    byWorkType: DistributionRow[];
    bySquad: DistributionRow[];
    byBusinessArea: DistributionRow[];
  };
  horizonView: {
    initiativesByHorizon: Record<Horizon, number>;
    effortByHorizon: DistributionRow[];
  };
  roadmap: {
    byQuarter: QuarterBucket[];
  };
  strategicAnalysis: {
    highAlignmentEffortPercent: number;
    effortByStrategicGoal: DistributionRow[];
    effortByPriority: DistributionRow[];
    workTypeEffort: DistributionRow[];
    runEffortPercent: number;
    criticalAndHighEffortPercent: number;
    deviations: string[];
  };
};

export type StrategicMetrics = {
  effortAlignedHighPercent: number;
  goalEffortPercent: Record<StrategicGoal, number>;
  deviations: string[];
};

function toPercent(part: number, total: number): number {
  if (total === 0) {
    return 0;
  }

  return (part / total) * 100;
}

export function calculateExecutiveMetrics(initiatives: Initiative[]) {
  const totalInitiatives = initiatives.length;
  const totalEstimatedHours = initiatives.reduce(
    (acc, item) => acc + item.estimated_hours,
    0,
  );
  const totalCost = initiatives.reduce((acc, item) => acc + item.total_cost, 0);
  const averageCostPerInitiative =
    totalInitiatives === 0 ? 0 : totalCost / totalInitiatives;

  const alignmentCount = countByStrategicAlignment(initiatives);

  return {
    totalInitiatives,
    totalEstimatedHours,
    totalCost,
    averageCostPerInitiative,
    alignmentPercentByLevel: {
      alto: toPercent(alignmentCount.alto, totalInitiatives),
      medio: toPercent(alignmentCount.medio, totalInitiatives),
      baixo: toPercent(alignmentCount.baixo, totalInitiatives),
    },
  };
}

export function countByStrategicAlignment(initiatives: Initiative[]) {
  return initiatives.reduce<Record<StrategicAlignment, number>>(
    (acc, item) => {
      acc[item.strategic_alignment] += 1;
      return acc;
    },
    { alto: 0, medio: 0, baixo: 0 },
  );
}

export function calculateHorizonMetrics(initiatives: Initiative[]) {
  const totalInitiatives = initiatives.length;
  const totalHours = initiatives.reduce((acc, item) => acc + item.estimated_hours, 0);
  const counts: Record<Horizon, number> = {
    curto: 0,
    medio: 0,
    longo: 0,
  };
  const effort: Record<Horizon, number> = {
    curto: 0,
    medio: 0,
    longo: 0,
  };

  for (const item of initiatives) {
    counts[item.horizon] += 1;
    effort[item.horizon] += item.estimated_hours;
  }

  return (["curto", "medio", "longo"] as Horizon[]).map((horizon) => ({
    horizon,
    count: counts[horizon],
    countShare: toPercent(counts[horizon], totalInitiatives),
    effortHours: effort[horizon],
    effortShare: toPercent(effort[horizon], totalHours),
  }));
}

export function calculateStrategicMetrics(
  initiatives: Initiative[],
): StrategicMetrics {
  const totalHours = initiatives.reduce((acc, item) => acc + item.estimated_hours, 0);

  const highAlignmentHours = initiatives
    .filter((item) => item.strategic_alignment === "alto")
    .reduce((acc, item) => acc + item.estimated_hours, 0);

  const goalHours = initiatives.reduce<Record<StrategicGoal, number>>(
    (acc, item) => {
      acc[item.strategic_goal] += item.estimated_hours;
      return acc;
    },
    { crescimento: 0, eficiencia: 0, compliance: 0 },
  );

  const runHours = initiatives
    .filter((item) => item.work_type === "run")
    .reduce((acc, item) => acc + item.estimated_hours, 0);
  const criticalAndHighHours = initiatives
    .filter((item) => item.prioridade === "critica" || item.prioridade === "alta")
    .reduce((acc, item) => acc + item.estimated_hours, 0);

  const runEffortPercent = toPercent(runHours, totalHours);
  const highAlignmentEffortPercent = toPercent(highAlignmentHours, totalHours);
  const criticalAndHighEffortPercent = toPercent(criticalAndHighHours, totalHours);

  return {
    effortAlignedHighPercent: highAlignmentEffortPercent,
    goalEffortPercent: {
      crescimento: toPercent(goalHours.crescimento, totalHours),
      eficiencia: toPercent(goalHours.eficiencia, totalHours),
      compliance: toPercent(goalHours.compliance, totalHours),
    },
    deviations: buildStrategicDeviations(
      runEffortPercent,
      highAlignmentEffortPercent,
      criticalAndHighEffortPercent,
    ),
  };
}

function buildDistribution(
  initiatives: Initiative[],
  keySelector: (initiative: Initiative) => DistributionKey,
): DistributionRow[] {
  const totalHours = initiatives.reduce((acc, item) => acc + item.estimated_hours, 0);
  const map = new Map<DistributionKey, { initiatives: number; hours: number }>();

  for (const item of initiatives) {
    const key = keySelector(item);
    const current = map.get(key) ?? { initiatives: 0, hours: 0 };

    current.initiatives += 1;
    current.hours += item.estimated_hours;
    map.set(key, current);
  }

  return Array.from(map.entries())
    .map(([key, value]) => ({
      key,
      initiatives: value.initiatives,
      hours: value.hours,
      percentage: toPercent(value.hours, totalHours),
    }))
    .sort((a, b) => b.hours - a.hours);
}

function buildAlignmentByInitiatives(initiatives: Initiative[]): DistributionRow[] {
  const total = initiatives.length;
  const map = new Map<StrategicAlignment, number>();

  for (const item of initiatives) {
    map.set(item.strategic_alignment, (map.get(item.strategic_alignment) ?? 0) + 1);
  }

  return (["alto", "medio", "baixo"] as StrategicAlignment[]).map((key) => {
    const initiativesCount = map.get(key) ?? 0;
    return {
      key,
      initiatives: initiativesCount,
      hours: 0,
      percentage: toPercent(initiativesCount, total),
    };
  });
}

function buildQuarterRoadmap(initiatives: Initiative[]): QuarterBucket[] {
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
  const map = new Map<string, QuarterBucket>();

  for (const item of initiatives) {
    const key = `${item.year}-${item.quarter}`;
    const current = map.get(key) ?? {
      year: item.year,
      quarter: item.quarter,
      initiatives: [],
    };

    current.initiatives.push(item);
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

function buildStrategicDeviations(
  runEffortPercent: number,
  highAlignmentEffortPercent: number,
  criticalAndHighEffortPercent: number,
): string[] {
  const deviations: string[] = [];

  if (runEffortPercent >= 45) {
    deviations.push(
      "Concentracao elevada em run: revisar capacidade para mudancas e transformacao.",
    );
  }

  if (highAlignmentEffortPercent < 50) {
    deviations.push(
      "Baixo percentual de esforco em alinhamento alto: reavaliar priorizacao executiva.",
    );
  }

  if (criticalAndHighEffortPercent < 60) {
    deviations.push(
      "Baixa cobertura de prioridades critica/alta no esforco total planejado.",
    );
  }

  if (deviations.length === 0) {
    deviations.push("Distribuicao de esforco sem desvios criticos no momento.");
  }

  return deviations;
}

export function buildExecutiveDashboardMetrics(
  initiatives: Initiative[],
): ExecutiveDashboardMetrics {
  const totalInitiatives = initiatives.length;
  const totalHours = initiatives.reduce((acc, item) => acc + item.estimated_hours, 0);
  const totalCost = initiatives.reduce((acc, item) => acc + item.total_cost, 0);
  const averageCostPerInitiative =
    totalInitiatives === 0 ? 0 : totalCost / totalInitiatives;

  const byWorkType = buildDistribution(initiatives, (item) => item.work_type);
  const bySquad = buildDistribution(initiatives, (item) => item.squad);
  const byBusinessArea = buildDistribution(initiatives, (item) => item.business_area);
  const effortByHorizon = buildDistribution(initiatives, (item) => item.horizon);
  const effortByStrategicGoal = buildDistribution(
    initiatives,
    (item) => item.strategic_goal,
  );
  const effortByPriority = buildDistribution(initiatives, (item) => item.prioridade);

  const initiativesByHorizon: Record<Horizon, number> = {
    curto: 0,
    medio: 0,
    longo: 0,
  };
  for (const item of initiatives) {
    initiativesByHorizon[item.horizon] += 1;
  }

  const highAlignmentHours = initiatives
    .filter((item) => item.strategic_alignment === "alto")
    .reduce((acc, item) => acc + item.estimated_hours, 0);
  const runHours = initiatives
    .filter((item) => item.work_type === "run")
    .reduce((acc, item) => acc + item.estimated_hours, 0);
  const criticalAndHighHours = initiatives
    .filter((item) => item.prioridade === "critica" || item.prioridade === "alta")
    .reduce((acc, item) => acc + item.estimated_hours, 0);

  const highAlignmentEffortPercent = toPercent(highAlignmentHours, totalHours);
  const runEffortPercent = toPercent(runHours, totalHours);
  const criticalAndHighEffortPercent = toPercent(criticalAndHighHours, totalHours);

  return {
    summary: {
      totalInitiatives,
      totalHours,
      totalCost,
      averageCostPerInitiative,
      alignmentByInitiatives: buildAlignmentByInitiatives(initiatives),
    },
    effortAllocation: {
      byWorkType,
      bySquad,
      byBusinessArea,
    },
    horizonView: {
      initiativesByHorizon,
      effortByHorizon,
    },
    roadmap: {
      byQuarter: buildQuarterRoadmap(initiatives),
    },
    strategicAnalysis: {
      highAlignmentEffortPercent,
      effortByStrategicGoal,
      effortByPriority,
      workTypeEffort: byWorkType,
      runEffortPercent,
      criticalAndHighEffortPercent,
      deviations: buildStrategicDeviations(
        runEffortPercent,
        highAlignmentEffortPercent,
        criticalAndHighEffortPercent,
      ),
    },
  };
}
