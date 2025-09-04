# Teste da API de Autenticação

## 🚀 Como Testar

### 1. Registrar um Novo Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teste123",
    "email": "teste@email.com",
    "fullName": "Usuário de Teste",
    "accessLevel": "editor",
    "password": "senha123"
  }'
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso!",
  "data": {
    "user": {
      "id": 1,
      "username": "teste123",
      "email": "teste@email.com",
      "fullName": "Usuário de Teste",
      "accessLevel": "editor"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teste123",
    "password": "senha123"
  }'
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso!",
  "data": {
    "user": {
      "id": 1,
      "username": "teste123",
      "email": "teste@email.com",
      "fullName": "Usuário de Teste",
      "accessLevel": "editor"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Obter Perfil (Protegido)
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Perfil obtido com sucesso!",
  "data": {
    "user": {
      "id": 1,
      "username": "teste123",
      "email": "teste@email.com",
      "fullName": "Usuário de Teste",
      "accessLevel": "editor"
    }
  }
}
```

### 4. Atualizar Perfil (Protegido)
```bash
curl -X PUT http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nome Atualizado",
    "email": "novo@email.com",
    "accessLevel": "admin"
  }'
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Perfil atualizado com sucesso!",
  "data": {
    "user": {
      "id": 1,
      "username": "teste123",
      "email": "novo@email.com",
      "fullName": "Nome Atualizado",
      "accessLevel": "admin"
    }
  }
}
```

### 5. Alterar Senha (Protegido)
```bash
curl -X POST http://localhost:3001/api/auth/change-password \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "senha123",
    "newPassword": "novaSenha456"
  }'
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Senha alterada com sucesso!"
}
```

### 6. Verificar Token (Protegido)
```bash
curl -X GET http://localhost:3001/api/auth/verify-token \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "userId": 1,
    "username": "teste123",
    "accessLevel": "editor"
  }
}
```

## 🔍 Validações Implementadas

### Registro
- ✅ Username: 3-50 caracteres, único
- ✅ Email: formato válido, único
- ✅ Nome completo: 2-100 caracteres
- ✅ Nível de acesso: "admin" ou "editor" (opcional, padrão: "editor")
- ✅ Senha: mínimo 6 caracteres

### Atualização de Perfil
- ✅ Validação opcional para campos fornecidos
- ✅ Verificação de unicidade para username e email
- ✅ Validação de formato para email
- ✅ Validação de nível de acesso

### Login
- ✅ Username e senha obrigatórios

## 🚨 Casos de Erro

### Usuário já existe
```json
{
  "success": false,
  "message": "Usuário ou email já existe"
}
```

### Email inválido
```json
{
  "success": false,
  "message": "Email válido é obrigatório"
}
```

### Nome muito curto
```json
{
  "success": false,
  "message": "Nome completo deve ter entre 2 e 100 caracteres"
}
```

### Nível de acesso inválido
```json
{
  "success": false,
  "message": "Nível de acesso deve ser \"admin\" ou \"editor\""
}
```

### Token inválido
```json
{
  "success": false,
  "message": "Token de acesso não fornecido"
}
```

## 🔐 Níveis de Acesso

### Admin
- Acesso total ao sistema
- Pode criar, editar e excluir qualquer recurso
- Pode gerenciar outros usuários

### Editor
- Acesso limitado ao sistema
- Pode criar e editar conteúdo
- Não pode excluir recursos críticos
- Não pode gerenciar usuários

## 🛡️ Middlewares de Autorização

### authenticateToken
- Verifica se o token JWT é válido
- Adiciona dados do usuário à requisição
- Usado em todas as rotas protegidas

### requireAdmin
- Restringe acesso apenas para administradores
- Retorna erro 403 para usuários não-admin
- Usado em rotas que requerem privilégios elevados

### requireAuth
- Restringe acesso para usuários autenticados
- Aceita tanto admin quanto editor
- Usado em rotas que requerem autenticação básica

## 💡 Dicas de Uso

1. **Guarde o token** retornado no login/registro
2. **Use o token** no header `Authorization: Bearer TOKEN`
3. **Valide os dados** antes de enviar
4. **Trate os erros** adequadamente no frontend
5. **Renove o token** quando necessário
6. **Verifique o nível de acesso** antes de executar ações críticas

## 🧪 Testando com Postman

Se preferir usar o Postman:

1. Crie uma nova collection
2. Configure as variáveis de ambiente:
   - `baseUrl`: `http://localhost:3001`
   - `token`: (será preenchido automaticamente)
3. Use os exemplos acima como referência
4. Configure o header `Authorization` com `Bearer {{token}}`

## 🔑 Usuários de Teste

### Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Access Level**: `admin`

### Editor
- **Username**: `editor`
- **Password**: `editor123`
- **Access Level**: `editor`
