import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

type Props = {
  plannedYtd: number;
  realizedYtd: number;
  committedYtd: number;
  balance: number;
  commitmentPercent: number;
};

export function MetricCards({
  plannedYtd,
  realizedYtd,
  committedYtd,
  balance,
  commitmentPercent,
}: Props) {
  const cards = [
    { label: "Orçado (YTD)", value: formatCurrency(plannedYtd) },
    { label: "Realizado (YTD)", value: formatCurrency(realizedYtd) },
    { label: "Comprometido (YTD)", value: formatCurrency(committedYtd) },
    { label: "Saldo (YTD)", value: formatCurrency(balance) },
    { label: "% comprometido", value: formatPercent(commitmentPercent) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="number-tabular text-2xl font-semibold tracking-tight">
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
