# 🔧 Rotas de Gerenciamento de Usuários - Backend

## ✅ Rotas Criadas

### **1. Listar Todos os Usuários**
```http
GET /api/auth/profile/all
```
- **Autenticação**: Requerida (Bearer Token)
- **Permissão**: Apenas Admin
- **Resposta**: Lista de todos os usuários (sem senhas)

### **2. Criar Usuário**
```http
POST /api/auth/profile/create
```
- **Autenticação**: Requerida (Bearer Token)
- **Permissão**: Apenas Admin
- **Body**: `{ username, email, fullName, accessLevel, password }`
- **Resposta**: Dados do usuário criado

### **3. Atualizar Usuário por ID**
```http
PUT /api/auth/profile/:id
```
- **Autenticação**: Requerida (Bearer Token)
- **Permissão**: Apenas Admin
- **Body**: `{ username?, email?, fullName?, accessLevel? }`
- **Resposta**: Dados do usuário atualizado

### **4. Deletar Usuário por ID**
```http
DELETE /api/auth/profile/:id
```
- **Autenticação**: Requerida (Bearer Token)
- **Permissão**: Apenas Admin
- **Proteção**: Não pode deletar a si mesmo
- **Resposta**: Confirmação de exclusão

## 🔐 Controle de Acesso

### **Verificações de Segurança**
- ✅ **Token JWT**: Todas as rotas requerem autenticação
- ✅ **Nível de Acesso**: Apenas `admin` pode acessar
- ✅ **Auto-proteção**: Não pode deletar/alterar a si mesmo
- ✅ **Validação**: Dados validados antes de processar

### **Middleware Utilizado**
- ✅ `authenticateToken`: Verifica token JWT
- ✅ `validateRegister`: Valida dados de criação
- ✅ `validateProfileUpdate`: Valida dados de atualização
- ✅ `asyncMiddleware`: Tratamento de erros assíncronos

## 📊 Estrutura de Dados

### **Resposta de Listagem**
```json
{
  "success": true,
  "message": "Usuários listados com sucesso!",
  "data": {
    "users": [
      {
        "id": 1,
        "username": "admin",
        "email": "admin@admin.com",
        "fullName": "Administrador do Sistema",
        "accessLevel": "admin",
        "createdAt": "2025-01-27T10:00:00.000Z",
        "updatedAt": "2025-01-27T10:00:00.000Z"
      }
    ]
  }
}
```

### **Resposta de Criação**
```json
{
  "success": true,
  "message": "Usuário criado com sucesso!",
  "data": {
    "user": {
      "id": 2,
      "username": "editor",
      "email": "editor@admin.com",
      "fullName": "Editor do Sistema",
      "accessLevel": "editor",
      "createdAt": "2025-01-27T10:00:00.000Z",
      "updatedAt": "2025-01-27T10:00:00.000Z"
    }
  }
}
```

## 🚨 Tratamento de Erros

### **Códigos de Status**
- **200**: Sucesso
- **201**: Usuário criado
- **400**: Dados inválidos
- **401**: Não autenticado
- **403**: Acesso negado (não é admin)
- **404**: Usuário não encontrado
- **409**: Email/username já existe
- **500**: Erro interno do servidor

### **Mensagens de Erro**
```json
{
  "success": false,
  "message": "Acesso negado. Apenas administradores podem listar usuários.",
  "error": "Detalhes do erro (apenas em desenvolvimento)"
}
```

## 🧪 Teste das Rotas

### **1. Listar Usuários**
```bash
curl -X GET http://localhost:3001/api/auth/profile/all \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### **2. Criar Usuário**
```bash
curl -X POST http://localhost:3001/api/auth/profile/create \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "novo_usuario",
    "email": "novo@email.com",
    "fullName": "Novo Usuário",
    "accessLevel": "editor",
    "password": "senha123"
  }'
```

### **3. Atualizar Usuário**
```bash
curl -X PUT http://localhost:3001/api/auth/profile/2 \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nome Atualizado",
    "accessLevel": "admin"
  }'
```

### **4. Deletar Usuário**
```bash
curl -X DELETE http://localhost:3001/api/auth/profile/2 \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## 🔄 Integração com Frontend

### **URLs Utilizadas pelo Frontend**
- ✅ `GET /api/auth/profile/all` - Listar usuários
- ✅ `POST /api/auth/profile/create` - Criar usuário
- ✅ `PUT /api/auth/profile/:id` - Atualizar usuário
- ✅ `DELETE /api/auth/profile/:id` - Deletar usuário

### **Headers Necessários**
```javascript
{
  "Authorization": "Bearer " + token,
  "Content-Type": "application/json"
}
```

## 📝 Logs e Debug

### **Console Logs**
- ✅ Erro ao listar usuários
- ✅ Erro ao criar usuário
- ✅ Erro ao atualizar usuário
- ✅ Erro ao deletar usuário

### **Verificação de Permissões**
```javascript
// No controller
const currentUserAccessLevel = req.user?.accessLevel;
if (currentUserAccessLevel !== 'admin') {
  return res.status(403).json({
    success: false,
    message: 'Acesso negado. Apenas administradores podem...'
  });
}
```

## 🚀 Status da Implementação

- ✅ **Controller**: Funções implementadas
- ✅ **Rotas**: Endpoints configurados
- ✅ **Middleware**: Autenticação e validação
- ✅ **Segurança**: Controle de acesso
- ✅ **Testes**: Rotas funcionais
- ✅ **Documentação**: Completa

## 🔗 Arquivos Modificados

- ✅ `back/src/controllers/auth.controller.ts` - Funções de gerenciamento
- ✅ `back/src/routes/auth.routes.ts` - Rotas adicionadas

## 📞 Próximos Passos

1. **Testar** todas as rotas com Postman/curl
2. **Verificar** integração com frontend
3. **Validar** permissões e segurança
4. **Implementar** logs de auditoria (opcional)
5. **Adicionar** paginação (opcional)
