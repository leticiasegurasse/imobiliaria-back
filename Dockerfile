# Dockerfile único e otimizado para deploy
# Usa Ubuntu como base para evitar problemas com Docker Hub
FROM ubuntu:22.04

# Instalar Node.js 18 via NodeSource (mais estável que Alpine)
RUN apt-get update && \
    apt-get install -y curl ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Criar diretório de trabalho
WORKDIR /app

# Copiar package files primeiro (para cache do Docker)
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Criar diretório de uploads
RUN mkdir -p uploads && chmod 755 uploads

# Criar usuário não-root para segurança
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Expor porta
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]

