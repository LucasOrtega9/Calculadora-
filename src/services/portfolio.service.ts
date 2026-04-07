import { portfolioItemsMock } from "@/mock/portfolio";
import type { PortfolioItem } from "@/types/portfolio";

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  // Simula uma chamada assincrona para facilitar migracao futura para API real.
  return Promise.resolve(portfolioItemsMock);
}
