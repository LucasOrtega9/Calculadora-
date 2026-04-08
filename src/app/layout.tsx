import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Painel Executivo de Portfólio de Tecnologia",
  description:
    "Painel interno para acompanhamento do portfólio de tecnologia por squad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full font-sans bg-[var(--btg-color-bg)] text-[var(--btg-color-text)]">
        {children}
      </body>
    </html>
  );
}
