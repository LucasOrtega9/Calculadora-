# Painel Executivo de Portfólio de Tecnologia

Base inicial de um projeto web interno para visualização executiva do portfólio de tecnologia por squad, com visão de curto, médio e longo prazo, incluindo esforço, custo interno e alinhamento estratégico.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- React 19

## Estrutura de pastas

```txt
src/
  app/                    # Rotas e layouts do App Router
  components/
    dashboard/            # Componentes específicos do painel
    layout/               # Shell e estrutura global de layout
  hooks/                  # Hooks de negócio e apresentação
  lib/                    # Utilitários puros
  mock/                   # Dados mockados para desenvolvimento inicial
  services/               # Camada de acesso a dados (mock por enquanto)
  types/                  # Tipos e contratos da aplicação
```

## Pré-requisitos

- Node.js >= 20.9
- npm >= 10

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Rode em modo desenvolvimento:

```bash
npm run dev
```

3. Abra no navegador:

```txt
http://localhost:3000
```

## Scripts úteis

```bash
npm run dev       # ambiente local
npm run lint      # análise estática
npm run typecheck # checagem de tipos TypeScript
npm run build     # build de produção
npm run start     # iniciar build em produção
```

## Estado atual da solução

- Estrutura base pronta para evolução
- Layout corporativo inicial implementado
- Dados de portfólio mockados (sem autenticação e sem integração Azure)
- Componentização inicial focada em escalabilidade

## Próximos passos sugeridos

- Criar rotas por visão executiva (ex.: `visao-geral`, `roadmap`, `custos`)
- Adicionar filtros por squad, horizonte e status
- Evoluir camada `services` para integração real com APIs internas
- Incluir testes unitários e de integração
