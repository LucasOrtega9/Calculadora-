# Sistema de Monitoramento do Cursor

Um sistema completo para monitorar o uso do Cursor, incluindo chamados, pedidos, valores, usuários e uso por usuário.

## 🚀 Funcionalidades

### 📊 Dashboard Principal
- **Visão Geral**: Estatísticas em tempo real
- **Gráficos Interativos**: Tendências de uso, features mais utilizadas
- **Métricas Chave**: Total de usuários, chamados abertos, pedidos pendentes
- **Top Usuários**: Ranking por tempo de uso

### 👥 Gerenciamento de Usuários
- Cadastro e edição de usuários
- Controle de departamentos e funções
- Status ativo/inativo
- Histórico de atividades

### 🎫 Sistema de Tickets/Chamados
- Criação e acompanhamento de tickets
- Prioridades (Baixa, Média, Alta, Crítica)
- Categorias (Bug, Feature, Performance, etc.)
- Atribuição de responsáveis
- Status de progresso

### 🛒 Gestão de Pedidos
- Controle de pedidos e solicitações
- Aprovações e fluxo de trabalho
- Controle de valores e moedas
- Rastreamento de status

### 📈 Monitoramento de Uso
- Registro detalhado de sessões
- Features utilizadas por usuário
- Projetos trabalhados
- Tipos de arquivo processados
- Análise de tendências

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.8+**
- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para banco de dados
- **SQLite/PostgreSQL** - Banco de dados
- **Pydantic** - Validação de dados

### Frontend
- **React 18** - Biblioteca JavaScript
- **Ant Design** - Componentes UI profissionais
- **Recharts** - Gráficos interativos
- **Axios** - Cliente HTTP
- **React Router** - Navegação

## 📋 Pré-requisitos

- Python 3.8 ou superior
- Node.js 16 ou superior
- npm ou yarn

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd cursor-monitoring-system
```

### 2. Configuração do Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente (opcional)
cp .env.example .env
# Editar .env com suas configurações

# Executar script de seed para dados de exemplo
python seed_data.py

# Iniciar servidor
python main.py
```

O backend estará rodando em `http://localhost:8000`

### 3. Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar aplicação de desenvolvimento
npm start
```

O frontend estará rodando em `http://localhost:3000`

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### Users
- Informações dos usuários
- Departamentos e funções
- Status ativo/inativo

#### Tickets
- Chamados e solicitações
- Prioridades e categorias
- Atribuição de responsáveis

#### Orders
- Pedidos e solicitações
- Valores e moedas
- Fluxo de aprovação

#### Usage
- Registros de uso do Cursor
- Sessões e duração
- Features e projetos

## 📊 API Endpoints

### Usuários
- `GET /users/` - Listar usuários
- `POST /users/` - Criar usuário
- `GET /users/{id}` - Obter usuário específico

### Tickets
- `GET /tickets/` - Listar tickets
- `POST /tickets/` - Criar ticket
- `GET /tickets/{id}` - Obter ticket específico

### Pedidos
- `GET /orders/` - Listar pedidos
- `POST /orders/` - Criar pedido
- `GET /orders/{id}` - Obter pedido específico

### Uso
- `GET /usage/` - Listar registros de uso
- `POST /usage/` - Criar registro de uso
- `GET /usage/{id}` - Obter registro específico

### Dashboard
- `GET /dashboard/stats` - Estatísticas gerais
- `GET /dashboard/users/{id}/stats` - Estatísticas por usuário
- `GET /dashboard/usage/trends` - Tendências de uso

## 🎯 Casos de Uso

### Para Administradores
- Monitorar uso geral da ferramenta
- Acompanhar performance dos usuários
- Gerenciar tickets e pedidos
- Análise de ROI e produtividade

### Para Gerentes
- Acompanhar equipe
- Análise de projetos
- Controle de orçamento
- Relatórios de produtividade

### Para Usuários
- Visualizar próprio uso
- Solicitar suporte via tickets
- Acompanhar pedidos
- Histórico de atividades

## 📈 Métricas e Relatórios

### Dashboard Principal
- Total de usuários ativos
- Chamados abertos vs. resolvidos
- Pedidos pendentes vs. aprovados
- Horas totais de uso
- Média de duração de sessão

### Análises por Usuário
- Tempo total de uso
- Features mais utilizadas
- Projetos trabalhados
- Histórico de tickets
- Valor total de pedidos

### Tendências Temporais
- Uso diário/semanal/mensal
- Usuários ativos por período
- Sazonalidade de uso
- Crescimento da base

## 🔧 Configurações Avançadas

### Banco de Dados
Por padrão, o sistema usa SQLite para desenvolvimento. Para produção:

```bash
# Configurar PostgreSQL
export DATABASE_URL="postgresql://user:password@localhost/cursor_monitor"
```

### Variáveis de Ambiente
```bash
# .env
DATABASE_URL=sqlite:///./cursor_monitoring.db
SECRET_KEY=your-secret-key
DEBUG=True
```

## 🚀 Deploy

### Backend (Produção)
```bash
# Usando Gunicorn
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (Produção)
```bash
npm run build
# Servir arquivos estáticos com nginx ou similar
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação da API em `/docs` (quando o backend estiver rodando)

## 🔮 Roadmap

- [ ] Autenticação e autorização
- [ ] Notificações em tempo real
- [ ] Integração com sistemas externos
- [ ] Relatórios exportáveis (PDF, Excel)
- [ ] API para coleta automática de dados
- [ ] Dashboard mobile responsivo
- [ ] Métricas avançadas de produtividade
- [ ] Integração com ferramentas de CI/CD

---

**Desenvolvido com ❤️ para monitorar e otimizar o uso do Cursor**