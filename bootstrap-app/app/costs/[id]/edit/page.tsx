import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { saveCostEntryAction } from "@/app/actions";
import { CostEntryForm } from "@/components/costs/cost-entry-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBudgetLineOptions } from "@/lib/budget-lines";
import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }> | { id: string };
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export default async function EditCostPage({ params, searchParams }: Props) {
  const { id } = await Promise.resolve(params);
  const query = searchParams ? await Promise.resolve(searchParams) : {};
  const error = Array.isArray(query.error) ? query.error[0] : query.error;

  const [cost, lines] = await Promise.all([
    prisma.costEntry.findUnique({
      where: { id },
      include: { splits: true },
    }),
    getBudgetLineOptions(),
  ]);

  if (!cost) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">Editar custo</h2>
        <p className="text-sm text-zinc-500">Atualize dados e regenere parcelas automaticamente.</p>
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
          <CostEntryForm
            action={saveCostEntryAction}
            budgetLines={lines}
            submitLabel="Salvar alterações"
            returnTo={`/costs/${id}/edit`}
            defaults={{
              id: cost.id,
              title: cost.title,
              vendor: cost.vendor,
              budgetLineId: cost.budgetLineId,
              type: cost.type,
              paymentMode: cost.paymentMode,
              startDate: cost.startDate,
              endDate: cost.endDate,
              oneOffDate: cost.oneOffDate,
              amountTotal: decimalToNumber(cost.amountTotal),
              amountPerPeriod: cost.amountPerPeriod
                ? decimalToNumber(cost.amountPerPeriod)
                : null,
              notes: cost.notes,
              status: cost.status,
              split: {
                ENFORCE: decimalToNumber(
                  cost.splits.find((item) => item.costCenter === "ENFORCE")?.percent ?? 100,
                ),
                DA: decimalToNumber(
                  cost.splits.find((item) => item.costCenter === "DA")?.percent ?? 0,
                ),
                IP: decimalToNumber(
                  cost.splits.find((item) => item.costCenter === "IP")?.percent ?? 0,
                ),
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
