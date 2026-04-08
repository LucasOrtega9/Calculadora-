export function DashboardHeader() {
  return (
    <header className="border-b border-[color:var(--btg-color-border)] bg-[color:var(--btg-color-bg)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-2 rounded bg-[color:var(--btg-color-primary)]" />
          <div>
            <p className="text-xs font-medium tracking-[0.08em] text-[color:var(--btg-color-text-muted)] uppercase">
              Portfolio de Tecnologia
            </p>
            <h1 className="text-lg font-bold text-[color:var(--btg-color-text)]">
              Painel Executivo
            </h1>
          </div>
        </div>
        <div className="rounded-md border border-[color:var(--btg-color-border)] bg-[color:var(--btg-color-surface)] px-3 py-1.5 text-xs font-medium text-[color:var(--btg-color-text-muted)]">
          Atualizacao interna
        </div>
      </div>
    </header>
  );
}
