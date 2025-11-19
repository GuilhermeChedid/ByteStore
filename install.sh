#!/bin/bash

echo "🚀 Instalação do ByteStore"
echo "=========================="
echo ""

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js não encontrado!"
    echo "Por favor, instale o Node.js: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js encontrado: $(node --version)"

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null
then
    echo "❌ npm não encontrado!"
    exit 1
fi

echo "✓ npm encontrado: $(npm --version)"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✓ Dependências instaladas com sucesso"

# Verificar se o MySQL está rodando
echo ""
echo "🔍 Verificando MySQL..."

if command -v mysql &> /dev/null
then
    echo "✓ MySQL encontrado"
    
    # Tentar configurar o banco de dados
    echo ""
    echo "⚙️  Configurando banco de dados..."
    npm run setup-db
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Instalação concluída com sucesso!"
        echo ""
        echo "Para iniciar o servidor, execute:"
        echo "  npm start"
        echo ""
        echo "O servidor estará disponível em: http://localhost:3000"
    else
        echo ""
        echo "⚠️  Não foi possível configurar o banco de dados automaticamente."
        echo "Por favor, configure manualmente:"
        echo "  1. Inicie o MySQL"
        echo "  2. Execute: npm run setup-db"
        echo "  3. Ou importe o arquivo bytestore.sql no phpMyAdmin"
    fi
else
    echo "⚠️  MySQL não encontrado ou não está no PATH"
    echo "Por favor, instale o MySQL e configure o banco de dados manualmente."
    echo ""
    echo "Após instalar o MySQL:"
    echo "  1. Execute: npm run setup-db"
    echo "  2. Ou importe o arquivo bytestore.sql no phpMyAdmin"
fi

echo ""
