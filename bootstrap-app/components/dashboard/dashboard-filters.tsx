"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { COST_STATUS_LABEL, MONTH_NAMES_PT } from "@/lib/constants";
import { type DashboardFilters } from "@/lib/filters";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  filters: DashboardFilters;
  years: number[];
  lines: Array<{ id: string; name: string; type: "OPEX" | "CAPEX" }>;
};

export function DashboardFiltersBar({ filters, years, lines }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [lineSearch, setLineSearch] = useState("");

  const filteredLines = useMemo(() => {
    if (!lineSearch.trim()) return lines;
    const query = lineSearch.toLowerCase();
    return lines.filter((line) => line.name.toLowerCase().includes(query));
  }, [lineSearch, lines]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Card className="mb-6">
      <CardContent className="grid grid-cols-1 gap-4 pt-5 md:grid-cols-3 xl:grid-cols-6">
        <div className="space-y-1.5">
          <Label htmlFor="year">Ano</Label>
          <Select
            id="year"
            value={String(filters.year)}
            onChange={(event) => setFilter("year", event.target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="month">Período mensal</Label>
          <Select
            id="month"
            value={filters.month ? String(filters.month) : "ALL"}
            onChange={(event) => setFilter("month", event.target.value)}
          >
            <option value="ALL">Todos os meses</option>
            {MONTH_NAMES_PT.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="center">Centro de custo</Label>
          <Select
            id="center"
            value={filters.costCenter}
            onChange={(event) => setFilter("costCenter", event.target.value)}
          >
            <option value="ALL">Todos</option>
            <option value="ENFORCE">Enforce</option>
            <option value="DA">DA</option>
            <option value="IP">IP</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="type">Tipo</Label>
          <Select
            id="type"
            value={filters.type}
            onChange={(event) => setFilter("type", event.target.value)}
          >
            <option value="ALL">Todos</option>
            <option value="OPEX">OPEX</option>
            <option value="CAPEX">CAPEX</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={filters.status}
            onChange={(event) => setFilter("status", event.target.value)}
          >
            <option value="ALL">Todos</option>
            <option value="PLANNED">{COST_STATUS_LABEL.PLANNED}</option>
            <option value="COMMITTED">{COST_STATUS_LABEL.COMMITTED}</option>
            <option value="PAID">{COST_STATUS_LABEL.PAID}</option>
            <option value="CANCELLED">{COST_STATUS_LABEL.CANCELLED}</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lineSearch">Linha de orçamento</Label>
          <Input
            id="lineSearch"
            placeholder="Buscar linha..."
            value={lineSearch}
            onChange={(event) => setLineSearch(event.target.value)}
          />
          <Select
            value={filters.lineId ?? "ALL"}
            onChange={(event) => setFilter("lineId", event.target.value)}
          >
            <option value="ALL">Todas as linhas</option>
            {filteredLines.map((line) => (
              <option key={line.id} value={line.id}>
                [{line.type}] {line.name}
              </option>
            ))}
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
