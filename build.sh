#!/bin/bash

# Script de build alternativo para quando Docker Hub está com problemas

echo "🔧 Tentando build com diferentes estratégias..."

# Estratégia 1: Usar Dockerfile simples
echo "📦 Tentando build com Dockerfile.simple..."
docker build -f Dockerfile.simple -t imobiliaria-backend:latest .

if [ $? -eq 0 ]; then
    echo "✅ Build com Dockerfile.simple bem-sucedido!"
    exit 0
fi

# Estratégia 2: Usar registry alternativo
echo "📦 Tentando build com registry alternativo..."
docker build --build-arg DOCKER_REGISTRY=ghcr.io -t imobiliaria-backend:latest .

if [ $? -eq 0 ]; then
    echo "✅ Build com registry alternativo bem-sucedido!"
    exit 0
fi

# Estratégia 3: Build local sem Docker
echo "📦 Tentando build local sem Docker..."
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build local bem-sucedido!"
    echo "🚀 Para rodar: npm start"
    exit 0
fi

echo "❌ Todas as estratégias falharam"
exit 1
