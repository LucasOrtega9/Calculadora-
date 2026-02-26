import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CAPEX & OPEX Control",
  description: "Controle financeiro local-first para orçamento e compromissos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-50 text-zinc-900 antialiased`}
      >
        <div className="min-h-screen">
          <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[260px_1fr]">
            <aside className="border-r border-zinc-200/70 bg-white p-6">
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Finance Ops
                </p>
                <h1 className="mt-2 text-xl font-semibold">CAPEX / OPEX</h1>
              </div>
              <MainNav />
            </aside>
            <main className="p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
