# Exemplos de Uso dos Middlewares de Autorização

## 🛡️ Middlewares Disponíveis

### 1. `authenticateToken`
Verifica se o usuário está autenticado e adiciona dados do usuário à requisição.

```typescript
import { authenticateToken } from '../middlewares/authMiddleware';

// Rota protegida básica
router.get('/profile', authenticateToken, getUserProfile);
```

### 2. `requireAdmin`
Restringe acesso apenas para usuários com nível de acesso "admin".

```typescript
import { requireAdmin } from '../middlewares/authMiddleware';

// Rota que requer privilégios de administrador
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);
```

### 3. `requireAuth`
Restringe acesso para usuários autenticados (admin ou editor).

```typescript
import { requireAuth } from '../middlewares/authMiddleware';

// Rota que requer autenticação básica
router.post('/content', authenticateToken, requireAuth, createContent);
```

## 🔐 Exemplos de Implementação

### Rota de Upload (Apenas Admin)
```typescript
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

// Apenas administradores podem fazer upload
router.post('/upload/image', 
  authenticateToken, 
  requireAdmin, 
  uploadImage
);
```

### Rota de Gerenciamento de Usuários (Apenas Admin)
```typescript
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

// Apenas administradores podem gerenciar usuários
router.get('/users', authenticateToken, requireAdmin, listUsers);
router.post('/users', authenticateToken, requireAdmin, createUser);
router.put('/users/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser);
```

### Rota de Conteúdo (Admin ou Editor)
```typescript
import { authenticateToken, requireAuth } from '../middlewares/authMiddleware';

// Administradores e editores podem gerenciar conteúdo
router.post('/posts', authenticateToken, requireAuth, createPost);
router.put('/posts/:id', authenticateToken, requireAuth, updatePost);

// Apenas administradores podem excluir
router.delete('/posts/:id', authenticateToken, requireAdmin, deletePost);
```

## 📝 Estrutura do Token JWT

O token JWT agora inclui o nível de acesso:

```json
{
  "userId": 1,
  "username": "admin",
  "accessLevel": "admin",
  "iat": 1693824000,
  "exp": 1693910400
}
```

## 🔍 Verificação de Nível de Acesso

### No Controller
```typescript
export const createUser = async (req: Request, res: Response) => {
  try {
    const { accessLevel } = req.user!;
    
    // Verificar se o usuário é admin
    if (accessLevel !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem criar usuários.'
      });
    }

    // Lógica para criar usuário...
    
  } catch (error) {
    // Tratamento de erro...
  }
};
```

### Verificação Condicional
```typescript
export const updateContent = async (req: Request, res: Response) => {
  try {
    const { accessLevel } = req.user!;
    const { contentId } = req.params;
    
    // Buscar conteúdo
    const content = await Content.findByPk(contentId);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Conteúdo não encontrado'
      });
    }
    
    // Editores só podem editar seu próprio conteúdo
    if (accessLevel === 'editor' && content.authorId !== req.user!.userId) {
      return res.status(403).json({
        success: false,
        message: 'Você só pode editar seu próprio conteúdo'
      });
    }
    
    // Lógica para atualizar conteúdo...
    
  } catch (error) {
    // Tratamento de erro...
  }
};
```

## 🚨 Respostas de Erro

### Acesso Negado (403)
```json
{
  "success": false,
  "message": "Acesso negado. Apenas administradores podem realizar esta ação."
}
```

### Token Inválido (401)
```json
{
  "success": false,
  "message": "Token de acesso não fornecido"
}
```

### Token Expirado (403)
```json
{
  "success": false,
  "message": "Token inválido ou expirado"
}
```

## 💡 Boas Práticas

### 1. Sempre use `authenticateToken` primeiro
```typescript
// ✅ Correto
router.post('/admin/users', authenticateToken, requireAdmin, createUser);

// ❌ Incorreto
router.post('/admin/users', requireAdmin, createUser);
```

### 2. Use `requireAdmin` para ações críticas
```typescript
// ✅ Ações que requerem admin
- Exclusão de usuários
- Configurações do sistema
- Relatórios administrativos
- Gerenciamento de permissões
```

### 3. Use `requireAuth` para ações básicas
```typescript
// ✅ Ações que requerem autenticação
- Criação de conteúdo
- Edição de perfil
- Upload de arquivos
- Visualização de dados privados
```

### 4. Verifique o nível de acesso no controller quando necessário
```typescript
// ✅ Para lógicas complexas de autorização
if (accessLevel === 'editor' && !canEditContent(userId, contentId)) {
  return res.status(403).json({
    success: false,
    message: 'Você não tem permissão para editar este conteúdo'
  });
}
```

## 🔄 Fluxo de Autorização

```
1. Requisição chega
2. authenticateToken verifica o token
3. requireAdmin/requireAuth verifica o nível de acesso
4. Controller executa a lógica
5. Resposta é enviada
```

## 📊 Tabela de Permissões

| Ação | Admin | Editor | Não Autenticado |
|------|-------|--------|------------------|
| Login | ✅ | ✅ | ✅ |
| Registro | ✅ | ✅ | ✅ |
| Ver perfil | ✅ | ✅ | ❌ |
| Atualizar perfil | ✅ | ✅ | ❌ |
| Alterar senha | ✅ | ✅ | ❌ |
| Upload de arquivos | ✅ | ❌ | ❌ |
| Gerenciar usuários | ✅ | ❌ | ❌ |
| Excluir conteúdo | ✅ | ❌ | ❌ |
| Criar conteúdo | ✅ | ✅ | ❌ |
| Editar conteúdo | ✅ | ✅ | ❌ |
