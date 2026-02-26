import Link from "next/link";
import { COST_STATUS_LABEL, PAYMENT_MODE_LABEL } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { cancelCostEntryAction, duplicateCostEntryAction } from "@/app/actions";

type CostRow = {
  id: string;
  title: string;
  vendor: string | null;
  type: "OPEX" | "CAPEX";
  paymentMode: "ONE_OFF" | "MONTHLY" | "ANNUAL";
  periodLabel: string;
  amountTotalNumber: number;
  realized: number;
  committed: number;
  status: "PLANNED" | "COMMITTED" | "PAID" | "CANCELLED";
  budgetLine: {
    name: string;
  };
};

function statusVariant(status: CostRow["status"]) {
  if (status === "PAID") return "success";
  if (status === "COMMITTED") return "info";
  if (status === "CANCELLED") return "danger";
  return "warning";
}

type Props = {
  rows: CostRow[];
};

export function CostsTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="text-zinc-600">Nenhum custo encontrado com os filtros atuais.</p>
        <Link
          href="/costs/new"
          className={cn(buttonVariants(), "mt-4")}
        >
          Cadastrar novo custo
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Linha</TableHead>
            <TableHead>Modo</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Realizado</TableHead>
            <TableHead className="text-right">Comprometido</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium text-zinc-900">{row.title}</TableCell>
              <TableCell>{row.vendor ?? "-"}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.budgetLine.name}</TableCell>
              <TableCell>{PAYMENT_MODE_LABEL[row.paymentMode]}</TableCell>
              <TableCell>{row.periodLabel}</TableCell>
              <TableCell className="number-tabular text-right">
                {formatCurrency(row.amountTotalNumber)}
              </TableCell>
              <TableCell className="number-tabular text-right">
                {formatCurrency(row.realized)}
              </TableCell>
              <TableCell className="number-tabular text-right">
                {formatCurrency(row.committed)}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(row.status)}>
                  {COST_STATUS_LABEL[row.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  <Link href={`/costs/${row.id}`} className={buttonVariants({ size: "sm", variant: "secondary" })}>
                    Ver
                  </Link>
                  <Link href={`/costs/${row.id}/edit`} className={buttonVariants({ size: "sm", variant: "ghost" })}>
                    Editar
                  </Link>

                  <form action={duplicateCostEntryAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <Button type="submit" size="sm" variant="ghost">
                      Duplicar
                    </Button>
                  </form>

                  {row.status !== "CANCELLED" ? (
                    <form action={cancelCostEntryAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <Button type="submit" size="sm" variant="destructive">
                        Cancelar
                      </Button>
                    </form>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
