import type { SquadMetrics } from "@/lib/squads/squad-metrics";

type SquadAlertsProps = {
  squad: SquadMetrics;
};

const badgeBySeverity = {
  alto: "border-[var(--btg-color-danger)]/35 bg-[var(--btg-color-danger)]/12",
  medio: "border-[var(--btg-color-warning)]/40 bg-[var(--btg-color-warning)]/16",
};

export function SquadAlerts({ squad }: SquadAlertsProps) {
  const checks = [
    {
      label: "Excesso de run",
      value: squad.alerts.runEffortPercent,
      threshold: 45,
      showAsPercent: true,
    },
    {
      label: "Baixo alinhamento estrategico",
      value: 100 - squad.alerts.highAlignmentEffortPercent,
      threshold: 50,
      showAsPercent: true,
    },
    {
      label: "Concentracao em curto prazo",
      value: squad.alerts.shortHorizonEffortPercent,
      threshold: 60,
      showAsPercent: true,
    },
    {
      label: "Baixa presenca de prioridades critica/alta",
      value: 100 - squad.alerts.criticalAndHighEffortPercent,
      threshold: 40,
      showAsPercent: true,
    },
  ];

  return (
    <section className="rounded-xl border border-[var(--btg-color-border)] bg-white p-4">
      <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--btg-color-text)]">
        Alertas do squad
      </h4>

      <div className="space-y-2">
        {checks.map((item) => {
          const severity = item.value >= item.threshold ? "alto" : "medio";
          const value = item.showAsPercent
            ? `${item.value.toFixed(1).replace(".", ",")}%`
            : String(item.value);

          return (
            <div
              key={item.label}
              className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${badgeBySeverity[severity]}`}
            >
              <span className="text-[var(--btg-color-text)]">{item.label}</span>
              <span className="font-bold text-[var(--btg-color-text)]">{value}</span>
            </div>
          );
        })}
      </div>

      <ul className="mt-3 space-y-1">
        {squad.alerts.messages.map((message) => (
          <li key={message} className="text-xs text-[var(--btg-color-text-muted)]">
            {message}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-[var(--btg-color-text-muted)]">
        {squad.alerts.insight}
      </p>
    </section>
  );
}
