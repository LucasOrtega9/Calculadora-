import { initiativesMock, portfolioItemsMock } from "@/mock/portfolio";
import type { Initiative } from "@/types/initiative";
import type { PortfolioItem } from "@/types/portfolio";

export async function getInitiatives(): Promise<Initiative[]> {
  // Simula uma chamada assincrona para facilitar migracao futura para API real.
  return Promise.resolve(initiativesMock);
}

// Alias de compatibilidade para manter a UI atual sem alteracao estrutural.
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  return Promise.resolve(portfolioItemsMock);
}
