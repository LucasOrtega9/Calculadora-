"use client";

import { useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { COST_STATUS_LABEL, PAYMENT_MODE_LABEL } from "@/lib/constants";
import { round2, toInputDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type BudgetLineOption = {
  id: string;
  name: string;
  type: "OPEX" | "CAPEX";
  depth: number;
};

type CostFormDefaults = {
  id?: string;
  title?: string;
  vendor?: string | null;
  budgetLineId?: string;
  type?: "OPEX" | "CAPEX";
  paymentMode?: "ONE_OFF" | "MONTHLY" | "ANNUAL";
  startDate?: Date | null;
  endDate?: Date | null;
  oneOffDate?: Date | null;
  amountTotal?: number;
  amountPerPeriod?: number | null;
  notes?: string | null;
  status?: "PLANNED" | "COMMITTED" | "PAID" | "CANCELLED";
  split?: { ENFORCE: number; DA: number; IP: number };
};

type Props = {
  action: (formData: FormData) => void;
  budgetLines: BudgetLineOption[];
  submitLabel?: string;
  defaults?: CostFormDefaults;
  returnTo?: string;
};

export function CostEntryForm({
  action,
  budgetLines,
  submitLabel = "Salvar custo",
  defaults,
  returnTo,
}: Props) {
  const [paymentMode, setPaymentMode] = useState(
    defaults?.paymentMode ?? "MONTHLY",
  );
  const [lineSearch, setLineSearch] = useState("");
  const [splitEnforce, setSplitEnforce] = useState(defaults?.split?.ENFORCE ?? 100);
  const [splitDa, setSplitDa] = useState(defaults?.split?.DA ?? 0);
  const [splitIp, setSplitIp] = useState(defaults?.split?.IP ?? 0);

  const splitTotal = round2(splitEnforce + splitDa + splitIp);
  const splitValid = Math.abs(splitTotal - 100) <= 0.01;

  const filteredLines = useMemo(() => {
    if (!lineSearch.trim()) return budgetLines;
    const query = lineSearch.toLowerCase();
    return budgetLines.filter((line) => line.name.toLowerCase().includes(query));
  }, [budgetLines, lineSearch]);

  return (
    <form action={action} className="space-y-6">
      {defaults?.id ? <input type="hidden" name="id" value={defaults.id} /> : null}
      {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Ex: Datadog - Observabilidade"
            defaultValue={defaults?.title}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="vendor">Fornecedor</Label>
          <Input
            id="vendor"
            name="vendor"
            placeholder="Ex: Datadog"
            defaultValue={defaults?.vendor ?? ""}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="type">Tipo *</Label>
          <Select
            id="type"
            name="type"
            required
            defaultValue={defaults?.type ?? "OPEX"}
          >
            <option value="OPEX">OPEX</option>
            <option value="CAPEX">CAPEX</option>
          </Select>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="lineSearch">Linha de orçamento *</Label>
          <Input
            id="lineSearch"
            placeholder="Buscar linha..."
            value={lineSearch}
            onChange={(event) => setLineSearch(event.target.value)}
          />
          <Select
            name="budgetLineId"
            required
            defaultValue={defaults?.budgetLineId}
            className="mt-2"
          >
            <option value="">Selecione uma linha</option>
            {filteredLines.map((line) => (
              <option key={line.id} value={line.id}>
                {"-".repeat(line.depth)} [{line.type}] {line.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="paymentMode">Modo *</Label>
          <Select
            id="paymentMode"
            name="paymentMode"
            required
            value={paymentMode}
            onChange={(event) =>
              setPaymentMode(event.target.value as "ONE_OFF" | "MONTHLY" | "ANNUAL")
            }
          >
            <option value="ONE_OFF">{PAYMENT_MODE_LABEL.ONE_OFF}</option>
            <option value="MONTHLY">{PAYMENT_MODE_LABEL.MONTHLY}</option>
            <option value="ANNUAL">{PAYMENT_MODE_LABEL.ANNUAL}</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            name="status"
            defaultValue={defaults?.status ?? "COMMITTED"}
          >
            <option value="PLANNED">{COST_STATUS_LABEL.PLANNED}</option>
            <option value="COMMITTED">{COST_STATUS_LABEL.COMMITTED}</option>
            <option value="PAID">{COST_STATUS_LABEL.PAID}</option>
            <option value="CANCELLED">{COST_STATUS_LABEL.CANCELLED}</option>
          </Select>
        </div>

        {paymentMode === "ONE_OFF" ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="oneOffDate">Data do pagamento *</Label>
              <Input
                id="oneOffDate"
                name="oneOffDate"
                type="date"
                required
                defaultValue={toInputDate(defaults?.oneOffDate)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amountTotal">Valor total (R$) *</Label>
              <Input
                id="amountTotal"
                name="amountTotal"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={defaults?.amountTotal}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Início *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={toInputDate(defaults?.startDate)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">Fim *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                required
                defaultValue={toInputDate(defaults?.endDate)}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="amountPerPeriod">
                Valor {paymentMode === "MONTHLY" ? "mensal" : "anual"} (R$) *
              </Label>
              <Input
                id="amountPerPeriod"
                name="amountPerPeriod"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={defaults?.amountPerPeriod ?? undefined}
              />
            </div>
          </>
        )}

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Notas adicionais sobre o compromisso..."
            defaultValue={defaults?.notes ?? ""}
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Rateio por centro de custo (%)</h3>
          <p className={`text-sm font-medium ${splitValid ? "text-emerald-600" : "text-red-600"}`}>
            Total: {splitTotal.toFixed(2)}%
          </p>
        </div>

        <div className="space-y-4">
          {[
            ["ENFORCE", splitEnforce, setSplitEnforce, "splitEnforce"],
            ["DA", splitDa, setSplitDa, "splitDa"],
            ["IP", splitIp, setSplitIp, "splitIp"],
          ].map(([label, value, setter, name]) => (
            <div key={label as string} className="grid grid-cols-[90px_1fr_120px] items-center gap-3">
              <Label>{label as string}</Label>
              <Input
                type="range"
                min="0"
                max="100"
                step="0.01"
                value={value as number}
                onChange={(event) => (setter as (v: number) => void)(Number(event.target.value))}
              />
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                name={name as string}
                value={value as number}
                onChange={(event) => (setter as (v: number) => void)(Number(event.target.value))}
              />
            </div>
          ))}
        </div>

        {!splitValid ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            A soma do rateio deve ser exatamente 100%.
          </div>
        ) : null}
      </div>

      <Button type="submit" disabled={!splitValid}>
        {submitLabel}
      </Button>
    </form>
  );
}
