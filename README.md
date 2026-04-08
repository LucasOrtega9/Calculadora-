# Painel Executivo de Portfolio de Tecnologia

Projeto web interno construido com Next.js (App Router), TypeScript e Tailwind CSS para apoiar a visao executiva do portfolio de tecnologia por squad.

## Objetivo

Disponibilizar um painel corporativo com foco em:

- horizonte de planejamento (curto, medio e longo prazo);
- esforco estimado por iniciativa;
- custo interno agregado;
- alinhamento estrategico de cada frente.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

## Estrutura de pastas

```text
src/
  app/                      # Rotas e layout global (App Router)
  components/               # Componentes reutilizaveis de UI
    dashboard/              # Componentes especificos do painel
  hooks/                    # Hooks customizados
  lib/                      # Utilitarios e helpers puros
  mock/                     # Dados mockados para desenvolvimento local
  services/                 # Camada de acesso a dados (sem integracao real)
  types/                    # Tipos e contratos TypeScript
```

## Como rodar localmente

### 1) Pre-requisitos

- Node.js 20+
- npm 10+

### 2) Instalacao

```bash
npm install
```

### 3) Ambiente de desenvolvimento

```bash
npm run dev
```

A aplicacao ficara disponivel em:

http://localhost:3000

### 4) Verificacoes

```bash
npm run lint
npm run build
```

## Estado atual da base

- Estrutura inicial pronta para crescimento;
- Layout corporativo inicial de dashboard;
- Sem autenticacao;
- Sem integracao real com Azure (somente mocks e servico interno simulado).

## Proximos passos sugeridos

1. Definir contrato de API para substituir mocks;
2. Incluir filtro por squad e horizonte;
3. Adicionar grafico executivo de capacidade x custo;
4. Evoluir camada de services para integracao real.
