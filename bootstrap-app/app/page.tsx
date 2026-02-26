import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BudgetTreeTable } from "@/components/dashboard/budget-tree-table";
import {
  CommitmentGauge,
  MomBudgetChart,
  YtdBudgetChart,
} from "@/components/dashboard/charts";
import { DashboardFiltersBar } from "@/components/dashboard/dashboard-filters";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { buttonVariants } from "@/components/ui/button";
import { getAvailableYears, getDashboardData } from "@/lib/dashboard";
import { parseDashboardFilters, type SearchParamsInput } from "@/lib/filters";
import { cn } from "@/lib/utils";

type Props = {
  searchParams?: Promise<SearchParamsInput> | SearchParamsInput;
};

export default async function Home({ searchParams }: Props) {
  const params = searchParams ? await Promise.resolve(searchParams) : {};
  const years = await getAvailableYears();
  const filters = parseDashboardFilters(params, years);
  const data = await getDashboardData(filters);

  if (data.availableLines.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-semibold">Sem dados de orçamento ainda</h2>
        <p className="mx-auto mt-3 max-w-2xl text-zinc-500">
          Importe o arquivo <strong>Pasta2.xlsx</strong> para carregar CAPEX/OPEX,
          rateios e começar a acompanhar Orçado, Realizado, Comprometido e Saldo.
        </p>
        <Link
          href="/import"
          className={cn(buttonVariants(), "mt-6")}
        >
          Ir para importação
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-semibold tracking-tight">Dashboard financeiro</h2>
        <p className="text-sm text-zinc-500">
          Visão consolidada de orçamento e execução para {data.year}.
        </p>
      </div>

      <DashboardFiltersBar
        filters={filters}
        years={data.availableYears.length > 0 ? data.availableYears : [filters.year]}
        lines={data.availableLines}
      />

      <MetricCards
        plannedYtd={data.totals.plannedYtd}
        realizedYtd={data.totals.realizedYtd}
        committedYtd={data.totals.committedYtd}
        balance={data.totals.balance}
        commitmentPercent={data.totals.commitmentPercent}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[340px_1fr]">
        <CommitmentGauge value={data.totals.commitmentPercent} />
        <MomBudgetChart data={data.momData} />
      </div>

      <YtdBudgetChart data={data.ytdData} />

      <BudgetTreeTable tree={data.tree} />
    </div>
  );
}
