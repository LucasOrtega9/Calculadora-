# CAPEX / OPEX Control (Local-First)

Aplicação web para controle de orçamento e compromissos financeiros com:

- **Next.js App Router + TypeScript**
- **TailwindCSS + componentes estilo shadcn/ui**
- **Prisma + SQLite local**
- **Importação Excel via SheetJS (`xlsx`)**
- **Dashboards com Recharts**

## Funcionalidades principais

- Importação/atualização de orçamento por linha e centro de custo (ENFORCE, DA, IP).
- Hierarquia de linhas de orçamento (grupo e sublinhas).
- Cadastro de custos CAPEX/OPEX (pontual, mensal e anual).
- Geração automática de parcelas (`PaymentSchedule`).
- Rateio por centro de custo com validação de 100%.
- Painel com métricas: **Orçado, Realizado, Comprometido, Saldo e % comprometido**.
- Filtros por ano, mês, centro de custo, tipo, linha e status.

## Como rodar localmente

```bash
pnpm i
pnpm prisma migrate dev
pnpm dev
```

Abra: [http://localhost:3000](http://localhost:3000)

## Banco e seed

Após migration, você pode popular dados iniciais:

```bash
pnpm db:seed
```

- Se existir `Pasta2.xlsx`, o seed tenta importar automaticamente.
- Se não existir, cria um baseline sintético (linha OPEX + custo mensal de exemplo).

## Importação do Excel

1. Coloque o arquivo **`Pasta2.xlsx`** na raiz desta pasta (`./Pasta2.xlsx`)  
   ou na raiz do workspace (`../Pasta2.xlsx`).
2. Acesse **`/import`**.
3. Clique em **“Importar/Atualizar do Pasta2.xlsx”**.

### Colunas esperadas (Planilha1)

- `BRL'000` (nome da linha)
- `YYYY-E` (ex: `2026-E`)
- `Enforce`
- `DA`
- `IP`

Os valores são convertidos de **BRL’000 para BRL** automaticamente (`* 1000`).

## Estrutura de rotas

- `/` → Dashboard
- `/costs` → Lista de custos
- `/costs/new` → Novo custo
- `/costs/[id]` → Detalhe do custo + marcação de parcelas pagas
- `/costs/[id]/edit` → Edição com regeneração de parcelas
- `/import` → Importação do orçamento e criação de linhas manuais
