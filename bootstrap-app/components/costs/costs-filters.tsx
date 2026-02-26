"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  year: number;
  years: number[];
  type: "ALL" | "OPEX" | "CAPEX";
  status: "ALL" | "PLANNED" | "COMMITTED" | "PAID" | "CANCELLED";
  costCenter: "ALL" | "ENFORCE" | "DA" | "IP";
  search: string;
};

export function CostsFilters({
  year,
  years,
  type,
  status,
  costCenter,
  search,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") params.delete(key);
    else params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-1.5">
          <Label>Ano</Label>
          <Select value={String(year)} onChange={(event) => setFilter("year", event.target.value)}>
            {years.map((currentYear) => (
              <option key={currentYear} value={currentYear}>
                {currentYear}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={type} onChange={(event) => setFilter("type", event.target.value)}>
            <option value="ALL">Todos</option>
            <option value="OPEX">OPEX</option>
            <option value="CAPEX">CAPEX</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onChange={(event) => setFilter("status", event.target.value)}>
            <option value="ALL">Todos</option>
            <option value="PLANNED">Planejado</option>
            <option value="COMMITTED">Comprometido</option>
            <option value="PAID">Pago</option>
            <option value="CANCELLED">Cancelado</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Centro de custo</Label>
          <Select
            value={costCenter}
            onChange={(event) => setFilter("costCenter", event.target.value)}
          >
            <option value="ALL">Todos</option>
            <option value="ENFORCE">Enforce</option>
            <option value="DA">DA</option>
            <option value="IP">IP</option>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Busca rápida</Label>
          <Input
            defaultValue={search}
            placeholder="Título ou fornecedor"
            onBlur={(event) => setFilter("search", event.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
