import { mockSquadRoadmap } from "@/mock/portfolio-data";
import type { PortfolioSnapshot, SquadRoadmap } from "@/types/portfolio";

export async function getPortfolioData(): Promise<SquadRoadmap[]> {
  // Mock local até a integração real com backend/Azure.
  return Promise.resolve(mockSquadRoadmap);
}

export function getPortfolioSnapshot(): PortfolioSnapshot {
  const totalInitiatives = mockSquadRoadmap.length;
  const totalEffort = mockSquadRoadmap.reduce(
    (accumulator, item) => accumulator + item.effortPoints,
    0
  );
  const totalCost = mockSquadRoadmap.reduce(
    (accumulator, item) => accumulator + item.internalCostBRL,
    0
  );
  const uniqueSquads = new Set(mockSquadRoadmap.map((item) => item.squadName));
  const highAlignmentCount = mockSquadRoadmap.filter(
    (item) => item.strategicAlignment === "alto"
  ).length;
  const highAlignmentRate =
    totalInitiatives === 0 ? 0 : highAlignmentCount / totalInitiatives;

  return {
    totalSquads: uniqueSquads.size,
    totalInitiatives,
    totalEffort,
    totalCost,
    highAlignmentRate,
  };
}
