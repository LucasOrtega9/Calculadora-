import type { PortfolioSnapshot, SquadRoadmap } from "@/types/portfolio";

type UsePortfolioMetricsResult = {
  summary: PortfolioSnapshot;
  totalInitiatives: number;
  averageEffort: number;
};

function getAverageEffort(initiatives: SquadRoadmap[]): number {
  if (initiatives.length === 0) {
    return 0;
  }

  const totalEffort = initiatives.reduce(
    (accumulator, item) => accumulator + item.effortPoints,
    0
  );

  return totalEffort / initiatives.length;
}

export function usePortfolioMetrics(
  summary: PortfolioSnapshot,
  initiatives: SquadRoadmap[]
): UsePortfolioMetricsResult {
  return {
    summary,
    totalInitiatives: initiatives.length,
    averageEffort: getAverageEffort(initiatives),
  };
}
