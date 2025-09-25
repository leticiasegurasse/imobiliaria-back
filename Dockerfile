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

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Remover devDependencies após o build para reduzir tamanho da imagem
RUN npm prune --production

# Criar diretório de uploads
RUN mkdir -p uploads && chmod 755 uploads

# Criar usuário não-root para segurança
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Expor porta
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]

