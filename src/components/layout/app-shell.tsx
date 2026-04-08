import type { ReactNode } from "react";

type AppShellProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export function AppShell({
  title = "Painel Executivo de Portfólio de Tecnologia",
  subtitle = "Visão consolidada das iniciativas por squad, horizonte e alinhamento estratégico.",
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--btg-color-surface)]">
      <header className="border-b border-[var(--btg-color-border)] bg-[var(--btg-color-bg)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <span className="mb-2 inline-flex rounded-full bg-[var(--btg-color-hover-overlay)] px-3 py-1 text-xs font-medium text-[var(--btg-color-primary)]">
            Portfólio de Tecnologia
          </span>
          <h1 className="text-2xl font-bold text-[var(--btg-color-text)]">{title}</h1>
          <p className="mt-1 text-sm text-[var(--btg-color-text-muted)]">{subtitle}</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
