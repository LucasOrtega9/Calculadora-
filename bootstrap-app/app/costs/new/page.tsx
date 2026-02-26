import { AlertTriangle } from "lucide-react";
import { saveCostEntryAction } from "@/app/actions";
import { CostEntryForm } from "@/components/costs/cost-entry-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBudgetLineOptions } from "@/lib/budget-lines";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export default async function NewCostPage({ searchParams }: Props) {
  const params = searchParams ? await Promise.resolve(searchParams) : {};
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const lines = await getBudgetLineOptions();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Novo custo</h2>
        <p className="text-sm text-zinc-500">
          Cadastre compromissos pontuais, mensais ou anuais com rateio por centro.
        </p>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4" />
          {decodeURIComponent(error)}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Dados do compromisso</CardTitle>
        </CardHeader>
        <CardContent>
          <CostEntryForm action={saveCostEntryAction} budgetLines={lines} />
        </CardContent>
      </Card>
    </div>
  );
}
