# Backend - API Simplificada

Este é o backend da aplicação, configurado com apenas as funcionalidades essenciais de autenticação e upload de arquivos.

## 🚀 Funcionalidades

### Autenticação
- ✅ Registro de usuários (username, email, nome completo, nível de acesso, senha)
- ✅ Login/Logout
- ✅ Renovação de tokens
- ✅ Recuperação de senha
- ✅ Gerenciamento de perfil
- ✅ Middleware de autenticação JWT
- ✅ Controle de acesso por nível (admin/editor)

### Upload de Arquivos
- ✅ Upload de imagens
- ✅ Servir arquivos estáticos
- ✅ Exclusão de arquivos
- ✅ Validação de tipos de arquivo
- ✅ Geração de nomes únicos

## 🏗️ Estrutura do Projeto

```
src/
├── config/
│   └── db.ts              # Configuração do banco de dados
├── controllers/
│   └── auth.controller.ts  # Controlador de autenticação
├── middlewares/
│   ├── asyncMiddleware.ts  # Middleware para funções assíncronas
│   ├── authMiddleware.ts   # Middleware de autenticação JWT
│   ├── errorMiddleware.ts  # Tratamento de erros
│   └── validationMiddleware.ts # Validação de dados
├── models/
│   └── user.model.ts       # Modelo de usuário
├── routes/
│   ├── auth.routes.ts      # Rotas de autenticação
│   └── upload.routes.ts    # Rotas de upload
├── scripts/
│   └── seed.ts            # Script para criar usuários padrão
└── server.ts              # Servidor principal
```

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados
DB_URL=postgres://user:password@localhost:5432/imobiliaria
# ou
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=imobiliaria

# JWT
JWT_SECRET=sua-chave-secreta-aqui

# Servidor
PORT=3001
NODE_ENV=development
```

### Instalação de Dependências
```bash
npm install
```

### Execução
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📡 Endpoints da API

### 🔐 Autenticação

#### Registro de Usuário
- `POST /api/auth/register`
  ```json
  {
    "username": "usuario123",
    "email": "usuario@email.com",
    "fullName": "Nome Completo do Usuário",
    "accessLevel": "editor",
    "password": "senha123"
  }
  ```

#### Login
- `POST /api/auth/login`
  ```json
  {
    "username": "usuario123",
    "password": "senha123"
  }
  ```

#### Outros Endpoints
- `POST /api/auth/logout` - Fazer logout
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/forgot-password` - Esqueci a senha
- `POST /api/auth/reset-password` - Redefinir senha
- `GET /api/auth/verify-token` - Verificar token (protegido)
- `GET /api/auth/profile` - Perfil do usuário (protegido)
- `PUT /api/auth/profile` - Atualizar perfil (protegido)
- `POST /api/auth/change-password` - Alterar senha (protegido)

### 📸 Upload
- `POST /api/upload/image` - Upload de imagem (protegido)
- `GET /uploads/:filename` - Servir arquivo de imagem
- `DELETE /api/upload/image/:filename` - Excluir imagem (protegido)

### 🏥 Sistema
- `GET /api/health` - Health check
- `GET /` - Rota de teste

## 🔒 Segurança e Controle de Acesso

- **CORS** configurado para permitir requisições cross-origin
- **Helmet** para headers de segurança
- **JWT** para autenticação
- **Validação** de dados de entrada
- **Hash** de senhas com bcrypt
- **Rate limiting** implícito através do Express

### Níveis de Acesso
- **`admin`**: Acesso total ao sistema
- **`editor`**: Acesso limitado (pode ser usado para editores de conteúdo)

### Middlewares de Autorização
- **`authenticateToken`**: Verifica se o usuário está autenticado
- **`requireAdmin`**: Restringe acesso apenas para administradores
- **`requireAuth`**: Restringe acesso para usuários autenticados (admin ou editor)

## 📊 Banco de Dados

- **PostgreSQL** como banco principal
- **Sequelize** como ORM
- **Migração automática** em desenvolvimento
- **Seed** para criar usuários padrão

### Modelo de Usuário
```typescript
interface User {
  id: number;
  username: string;      // Único, 3-50 caracteres
  email: string;         // Único, formato válido
  fullName: string;      // 2-100 caracteres
  accessLevel: 'admin' | 'editor'; // Nível de acesso
  password: string;      // Hash com bcrypt
  createdAt: Date;
  updatedAt: Date;
}
```

### Usuários Padrão
- **Admin**:
  - Username: `admin`
  - Password: `admin123`
  - Email: `admin@admin.com`
  - Nome: `Administrador do Sistema`
  - Nível: `admin`

- **Editor**:
  - Username: `editor`
  - Password: `editor123`
  - Email: `editor@admin.com`
  - Nome: `Editor do Sistema`
  - Nível: `editor`

## 🚨 Tratamento de Erros

- Middleware centralizado para captura de erros
- Respostas padronizadas com formato JSON
- Logs detalhados em desenvolvimento
- Códigos de status HTTP apropriados

## 📝 Logs

- **Morgan** para logs de requisições HTTP
- **Console** para logs de aplicação
- **Timestamps** em todas as operações

## 🔄 Desenvolvimento

### Hot Reload
O projeto usa `nodemon` para recarregamento automático durante o desenvolvimento.

### TypeScript
- Configuração completa de TypeScript
- Tipos para todas as entidades
- Interfaces para validação de dados

## 📦 Dependências Principais

- **Express** - Framework web
- **Sequelize** - ORM para banco de dados
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **bcrypt** - Hash de senhas
- **CORS** - Cross-origin resource sharing
- **Helmet** - Segurança

## 🚀 Deploy

### Docker
```bash
docker build -t backend .
docker run -p 3001:3001 backend
```

### Produção
1. Configure as variáveis de ambiente
2. Execute `npm run build`
3. Inicie com `npm start`
4. Configure um proxy reverso (nginx) se necessário

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com a equipe de desenvolvimento.
