import type { PortfolioItem, StrategicAlignment } from "@/types/portfolio";

const alignmentClassName: Record<StrategicAlignment, string> = {
  alto: "bg-[var(--btg-color-success)]/20 text-[var(--btg-color-text)]",
  medio: "bg-[var(--btg-color-warning)]/25 text-[var(--btg-color-text)]",
  baixo: "bg-[var(--btg-color-danger)]/20 text-[var(--btg-color-text)]",
};

type StrategicAlignmentProps = {
  items: PortfolioItem[];
};

export function StrategicAlignment({ items }: StrategicAlignmentProps) {
  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-6 shadow-sm">
      <header className="mb-4">
        <h2 className="text-lg font-bold">Alinhamento Estrategico</h2>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Visao consolidada da aderencia de cada iniciativa aos objetivos do
          portfolio.
        </p>
      </header>

      <div className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-[var(--btg-color-border)] p-4"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold">{item.initiative}</h3>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                  alignmentClassName[item.strategicAlignment]
                }`}
              >
                {item.strategicAlignment}
              </span>
            </div>
            <p className="text-xs text-[var(--btg-color-text-muted)]">
              Squad: {item.squad} - Horizonte: {item.horizon}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
