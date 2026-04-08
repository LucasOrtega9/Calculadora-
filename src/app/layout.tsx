import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Painel Executivo de Portfolio de Tecnologia",
  description:
    "Visao executiva do portfolio de tecnologia por squad, horizonte e alinhamento estrategico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
