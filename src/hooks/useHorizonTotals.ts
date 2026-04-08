import { useMemo } from "react";
import type { Horizon, PortfolioItem } from "@/types/portfolio";

type HorizonTotals = Record<Horizon, number>;

const initialTotals: HorizonTotals = {
  curto: 0,
  medio: 0,
  longo: 0,
};

export function useHorizonTotals(items: PortfolioItem[]) {
  return useMemo(() => {
    return items.reduce<HorizonTotals>((acc, item) => {
      acc[item.horizon] += item.effortPoints;
      return acc;
    }, { ...initialTotals });
  }, [items]);
}
