#!/bin/bash

echo "🚀 Iniciando Sistema de Monitoramento do Cursor"
echo "================================================"

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.8+"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 16+"
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale npm"
    exit 1
fi

echo "✅ Dependências verificadas com sucesso!"

# Configurar backend
echo ""
echo "🔧 Configurando Backend..."
cd backend

# Criar ambiente virtual se não existir
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual Python..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
echo "🔌 Ativando ambiente virtual..."
source venv/bin/activate

# Instalar dependências
echo "📥 Instalando dependências Python..."
pip install -r requirements.txt

# Executar seed de dados
echo "🌱 Populando banco com dados de exemplo..."
python seed_data.py

# Iniciar backend em background
echo "🚀 Iniciando servidor backend..."
python main.py &
BACKEND_PID=$!

# Aguardar backend inicializar
echo "⏳ Aguardando backend inicializar..."
sleep 5

# Configurar frontend
echo ""
echo "🔧 Configurando Frontend..."
cd ../frontend

# Instalar dependências
echo "📥 Instalando dependências Node.js..."
npm install

# Iniciar frontend
echo "🚀 Iniciando aplicação frontend..."
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Sistema iniciado com sucesso!"
echo "================================="
echo "📊 Backend: http://localhost:8000"
echo "🎨 Frontend: http://localhost:3000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "💡 Para parar o sistema, pressione Ctrl+C"
echo ""

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Parando sistema..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Sistema parado com sucesso!"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Manter script rodando
wait