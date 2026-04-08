type InitiativeAlertsProps = {
  alerts: {
    lowPriorityHighCost: boolean;
    lowAlignment: boolean;
    longTermHighEffort: boolean;
    riskyStatus: boolean;
  };
  alertInsight: string;
};

const severityStyles = {
  alto: "border-[var(--btg-color-danger)]/40 bg-[var(--btg-color-danger)]/12",
  medio:
    "border-[var(--btg-color-warning)]/40 bg-[var(--btg-color-warning)]/18",
};

export function InitiativeAlerts({ alerts, alertInsight }: InitiativeAlertsProps) {
  const checks = [
    {
      label: "Prioridade baixa com custo alto",
      value: alerts.lowPriorityHighCost ? "Sim" : "Nao",
      severity: alerts.lowPriorityHighCost ? "alto" : "medio",
    },
    {
      label: "Alinhamento baixo",
      value: alerts.lowAlignment ? "Sim" : "Nao",
      severity: alerts.lowAlignment ? "alto" : "medio",
    },
    {
      label: "Prazo longo com esforco alto",
      value: alerts.longTermHighEffort ? "Sim" : "Nao",
      severity: alerts.longTermHighEffort ? "medio" : "medio",
    },
    {
      label: "Status em risco ou bloqueado",
      value: alerts.riskyStatus ? "Sim" : "Nao",
      severity: alerts.riskyStatus ? "alto" : "medio",
    },
  ] as const;

  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-white p-5">
      <header className="mb-3">
        <h3 className="text-base font-bold text-[var(--btg-color-text)]">
          Alertas da iniciativa
        </h3>
        <p className="text-sm text-[var(--btg-color-text-muted)]">
          Risco e consistencia de direcionamento.
        </p>
      </header>

      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${severityStyles[check.severity]}`}
          >
            <span>{check.label}</span>
            <span className="font-bold">{check.value}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-[var(--btg-color-text-muted)]">{alertInsight}</p>
    </section>
  );
}
