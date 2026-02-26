import Link from "next/link";
import { Plus } from "lucide-react";
import { CostsFilters } from "@/components/costs/costs-filters";
import { CostsTable } from "@/components/costs/costs-table";
import { buttonVariants } from "@/components/ui/button";
import { listCosts } from "@/lib/costs";
import { getBudgetYears, parseCostsFilters } from "@/lib/budget-lines";
import { cn } from "@/lib/utils";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export default async function CostsPage({ searchParams }: Props) {
  const params = searchParams ? await Promise.resolve(searchParams) : {};
  const years = await getBudgetYears();
  const filters = parseCostsFilters(params);
  const safeYear =
    years.length > 0
      ? years.includes(filters.year)
        ? filters.year
        : years[0]
      : filters.year;

  const rows = await listCosts({
    year: safeYear,
    type: filters.type,
    status: filters.status,
    search: filters.search,
    costCenter: filters.costCenter,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Custos e compromissos</h2>
          <p className="text-sm text-zinc-500">
            Cadastre, acompanhe e ajuste compromissos CAPEX/OPEX.
          </p>
        </div>
        <Link href="/costs/new" className={cn(buttonVariants())}>
          <Plus className="mr-2 h-4 w-4" />
          Novo custo
        </Link>
      </div>

      <CostsFilters
        year={safeYear}
        years={years.length > 0 ? years : [safeYear]}
        type={filters.type}
        status={filters.status}
        costCenter={filters.costCenter}
        search={filters.search}
      />

      <CostsTable rows={rows} />
    </div>
  );
}
