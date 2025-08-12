# 🚀 Início Rápido - Sistema de Monitoramento do Cursor

## ⚡ Inicialização Automática

### Opção 1: Script Automático (Recomendado)
```bash
# Dar permissão de execução (apenas na primeira vez)
chmod +x start.sh

# Executar script de inicialização
./start.sh
```

### Opção 2: Inicialização Manual

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
python seed_data.py
python main.py
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## 🌐 Acessos

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs

## 📊 Funcionalidades Principais

### Dashboard
- Visão geral com estatísticas em tempo real
- Gráficos de tendências de uso
- Top usuários e features

### Usuários
- Gerenciamento completo de usuários
- Controle de departamentos e funções

### Tickets
- Sistema de chamados e suporte
- Prioridades e categorias
- Atribuição de responsáveis

### Pedidos
- Controle de solicitações
- Aprovações e fluxo de trabalho
- Controle de valores

### Uso
- Monitoramento detalhado de sessões
- Features utilizadas
- Projetos trabalhados

## 🔧 Dados de Exemplo

O sistema já vem com dados de exemplo incluindo:
- 5 usuários de diferentes departamentos
- Tickets de exemplo
- Pedidos de exemplo
- 30 dias de dados de uso simulados

## 📱 Interface

- Design responsivo e moderno
- Navegação intuitiva
- Gráficos interativos
- Tabelas com paginação
- Formulários de cadastro/edição

## 🛠️ Tecnologias

- **Backend**: Python + FastAPI + SQLAlchemy
- **Frontend**: React + Ant Design + Recharts
- **Banco**: SQLite (dev) / PostgreSQL (prod)

## ❓ Suporte

- Consulte o README.md completo
- Verifique a documentação da API em /docs
- Abra uma issue no repositório

---

**🎯 Sistema pronto para uso em produção!**