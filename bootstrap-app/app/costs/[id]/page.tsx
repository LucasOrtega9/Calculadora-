import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cancelCostEntryAction, toggleSchedulePaidAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { COST_CENTER_LABEL, COST_STATUS_LABEL, PAYMENT_MODE_LABEL } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { cn, decimalToNumber, formatCurrency } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }> | { id: string };
};

function statusVariant(status: "PLANNED" | "COMMITTED" | "PAID" | "CANCELLED") {
  if (status === "PAID") return "success";
  if (status === "COMMITTED") return "info";
  if (status === "CANCELLED") return "danger";
  return "warning";
}

export default async function CostDetailsPage({ params }: Props) {
  const { id } = await Promise.resolve(params);

  const cost = await prisma.costEntry.findUnique({
    where: { id },
    include: {
      budgetLine: true,
      splits: true,
      schedules: {
        orderBy: { dueDate: "asc" },
      },
    },
  });

  if (!cost) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{cost.title}</h2>
          <p className="text-sm text-zinc-500">
            Última alteração em{" "}
            {format(cost.updatedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant(cost.status)}>{COST_STATUS_LABEL[cost.status]}</Badge>
          <Link
            href={`/costs/${cost.id}/edit`}
            className={cn(buttonVariants({ variant: "secondary" }))}
          >
            Editar
          </Link>
          {cost.status !== "CANCELLED" ? (
            <form action={cancelCostEntryAction}>
              <input type="hidden" name="id" value={cost.id} />
              <Button type="submit" variant="destructive">
                Cancelar custo
              </Button>
            </form>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Fornecedor</p>
              <p className="text-sm">{cost.vendor ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Linha</p>
              <p className="text-sm">{cost.budgetLine.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Tipo</p>
              <p className="text-sm">{cost.type}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Modo</p>
              <p className="text-sm">{PAYMENT_MODE_LABEL[cost.paymentMode]}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Valor total</p>
              <p className="text-sm font-semibold number-tabular">
                {formatCurrency(decimalToNumber(cost.amountTotal))}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Valor por período</p>
              <p className="text-sm number-tabular">
                {cost.amountPerPeriod
                  ? formatCurrency(decimalToNumber(cost.amountPerPeriod))
                  : "-"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Observações</p>
              <p className="text-sm">{cost.notes ?? "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rateio por centro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(cost.splits.length > 0
              ? cost.splits
              : [{ costCenter: "ENFORCE", percent: 100 } as const]
            ).map((split) => {
              const percent = decimalToNumber(split.percent);
              return (
                <div key={split.costCenter} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{COST_CENTER_LABEL[split.costCenter]}</span>
                    <span className="number-tabular font-medium">{percent.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-zinc-900"
                      style={{ width: `${Math.max(0, Math.min(percent, 100))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cronograma de parcelas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competência</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pago em</TableHead>
                <TableHead className="w-[260px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cost.schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{format(schedule.dueDate, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell className="number-tabular text-right">
                    {formatCurrency(decimalToNumber(schedule.amount))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        schedule.status === "PAID"
                          ? "success"
                          : schedule.status === "CANCELLED"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {schedule.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {schedule.paidAt
                      ? format(schedule.paidAt, "dd/MM/yyyy", { locale: ptBR })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {schedule.status !== "CANCELLED" ? (
                      <form action={toggleSchedulePaidAction} className="flex items-end gap-2">
                        <input type="hidden" name="scheduleId" value={schedule.id} />
                        <input type="hidden" name="costEntryId" value={cost.id} />
                        <input
                          type="hidden"
                          name="paid"
                          value={schedule.status === "PAID" ? "false" : "true"}
                        />
                        {schedule.status !== "PAID" ? (
                          <input
                            type="date"
                            name="paidAt"
                            defaultValue={format(new Date(), "yyyy-MM-dd")}
                            className="h-9 rounded-lg border border-zinc-300 px-2 text-sm"
                          />
                        ) : null}
                        <Button type="submit" size="sm" variant="secondary">
                          {schedule.status === "PAID" ? "Reabrir" : "Marcar como pago"}
                        </Button>
                      </form>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
