type SummaryCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function SummaryCard({ label, value, helper }: SummaryCardProps) {
  return (
    <article className="rounded-xl border border-[var(--btg-color-border)] bg-[var(--btg-color-bg)] p-[var(--btg-space-4)] shadow-sm">
      <p className="text-sm text-[var(--btg-color-text-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[var(--btg-color-text)]">{value}</p>
      {helper ? (
        <p className="mt-2 text-xs text-[var(--btg-color-text-muted)]">{helper}</p>
      ) : null}
    </article>
  );
}
