import { formatCurrencyBRL, formatNumber } from "@/lib/format";
import type { PortfolioItem } from "@/types/portfolio";

type SummaryCardsProps = {
  items: PortfolioItem[];
};

type CardProps = {
  title: string;
  value: string;
  subtitle: string;
};

function Card({ title, value, subtitle }: CardProps) {
  return (
    <article className="rounded-xl border border-[var(--btg-color-border)] bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-[var(--btg-color-text-muted)]">{title}</p>
      <p className="mt-2 text-2xl font-bold text-[var(--btg-color-text)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--btg-color-text-muted)]">{subtitle}</p>
    </article>
  );
}

export function SummaryCards({
  items,
}: SummaryCardsProps) {
  const totalSquads = new Set(items.map((item) => item.squad)).size;
  const totalInitiatives = items.length;
  const totalEffort = items.reduce((acc, item) => acc + item.effortPoints, 0);
  const totalCost = items.reduce(
    (acc, item) => acc + item.monthlyInternalCost,
    0,
  );

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card
        title="Squads mapeados"
        value={formatNumber(totalSquads)}
        subtitle="Portfolio consolidado"
      />
      <Card
        title="Iniciativas ativas"
        value={formatNumber(totalInitiatives)}
        subtitle="Curto, medio e longo prazo"
      />
      <Card
        title="Esforco total (pts)"
        value={formatNumber(totalEffort)}
        subtitle="Carga planejada"
      />
      <Card
        title="Custo interno total"
        value={formatCurrencyBRL(totalCost)}
        subtitle="Estimativa agregada"
      />
    </section>
  );
}
