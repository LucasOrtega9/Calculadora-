"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type MonthData = { month: string; planned: number; realized: number };
type YtdData = { month: string; plannedAcc: number; realizedAcc: number };

export function CommitmentGauge({ value }: { value: number }) {
  const normalized = Math.max(0, Math.min(value, 100));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget comprometido</CardTitle>
        <CardDescription>Realizado + Comprometido sobre orçamento YTD</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-3 w-full rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-zinc-900 transition-all"
            style={{ width: `${normalized}%` }}
          />
        </div>
        <p className="mt-4 text-center text-3xl font-semibold number-tabular">
          {normalized.toFixed(2)}%
        </p>
      </CardContent>
    </Card>
  );
}

export function MomBudgetChart({ data }: { data: MonthData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget x Realizado (MoM)</CardTitle>
        <CardDescription>Comparativo mensal no ano selecionado</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value).replace("R$", "R$ ")}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{ borderRadius: 12, borderColor: "#e4e4e7" }}
            />
            <Bar dataKey="planned" fill="#a1a1aa" radius={[8, 8, 0, 0]} name="Orçado" />
            <Bar dataKey="realized" fill="#111827" radius={[8, 8, 0, 0]} name="Realizado" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function YtdBudgetChart({ data }: { data: YtdData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget x Realizado (YTD acumulado)</CardTitle>
        <CardDescription>Evolução acumulada mês a mês</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value).replace("R$", "R$ ")}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{ borderRadius: 12, borderColor: "#e4e4e7" }}
            />
            <Line
              type="monotone"
              dataKey="plannedAcc"
              stroke="#71717a"
              strokeWidth={2.5}
              dot={false}
              name="Orçado acumulado"
            />
            <Line
              type="monotone"
              dataKey="realizedAcc"
              stroke="#111827"
              strokeWidth={2.5}
              dot={false}
              name="Realizado acumulado"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
