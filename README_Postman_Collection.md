# 📋 Collection Postman - Imobiliária Vagner & Luiz

Esta collection do Postman contém todas as rotas da API da Imobiliária Vagner & Luiz, organizadas por categorias para facilitar o teste e desenvolvimento.

## 📁 Arquivos Incluídos

- `Imobiliaria_Vagner_Luiz_API.postman_collection.json` - Collection principal com todas as rotas
- `Imobiliaria_Vagner_Luiz_Environment.postman_environment.json` - Environment com variáveis configuradas
- `README_Postman_Collection.md` - Este arquivo de instruções

## 🚀 Como Importar

1. Abra o Postman
2. Clique em "Import" no canto superior esquerdo
3. Selecione os arquivos `.json` da collection e environment
4. Configure o environment "Imobiliária Vagner & Luiz - Environment"

## ⚙️ Configuração do Environment

### Variáveis Disponíveis:
- `baseUrl`: URL base da API (padrão: http://localhost:3001)
- `token`: Token de autenticação JWT (será preenchido automaticamente após login)
- `userId`: ID do usuário (para testes)
- `propertyId`: ID de propriedade (para testes)
- `cityId`: ID de cidade (para testes)
- `neighborhoodId`: ID de bairro (para testes)
- `propertyTypeId`: ID de tipo de imóvel (para testes)

## 📚 Estrutura da Collection

### 🔐 Autenticação
- **Registrar Usuário**: Criação de novos usuários
- **Login**: Autenticação e obtenção do token JWT
- **Logout**: Encerramento de sessão
- **Renovar Token**: Renovação do token de acesso
- **Esqueci a Senha**: Solicitação de reset de senha
- **Redefinir Senha**: Redefinição de senha com token
- **Verificar Token**: Validação do token atual
- **Perfil do Usuário**: Visualização e atualização do perfil
- **Alterar Senha**: Mudança de senha do usuário logado
- **Gerenciamento de Usuários**: CRUD completo (apenas admin)

### 🏠 Propriedades
- **Listar Propriedades**: Listagem com filtros avançados
- **Propriedades em Destaque**: Lista de imóveis destacados
- **Imóvel do Mês**: Propriedade em destaque mensal
- **CRUD Completo**: Criar, ler, atualizar e excluir propriedades
- **Ações Especiais**: Toggle de status, destaque e imóvel do mês

### 🏙️ Cidades
- **Listar Cidades**: Listagem com filtros por estado
- **Cidades por Estado**: Busca específica por UF
- **CRUD Completo**: Gerenciamento completo de cidades
- **Toggle Status**: Ativar/desativar cidades

### 🏘️ Bairros
- **Listar Bairros**: Listagem com filtros por cidade
- **Bairros por Cidade**: Busca específica por cidade
- **CRUD Completo**: Gerenciamento completo de bairros
- **Toggle Status**: Ativar/desativar bairros

### 🏢 Tipos de Imóvel
- **Listar Tipos**: Listagem com filtros por categoria
- **Categorias Disponíveis**: Lista de categorias (residencial, comercial, rural, terreno)
- **Tipos por Categoria**: Busca específica por categoria
- **CRUD Completo**: Gerenciamento completo de tipos
- **Toggle Status**: Ativar/desativar tipos

### 📸 Upload
- **Upload de Imagem**: Envio de arquivos de imagem
- **Servir Arquivo**: Acesso direto aos arquivos
- **Excluir Imagem**: Remoção de arquivos

### ⚙️ Configurações
- **Buscar Configurações**: Obter todas as configurações
- **Buscar Seção**: Obter seção específica
- **Atualizar Configurações**: Modificar configurações completas
- **Atualizar Seção**: Modificar seção específica

### 🏥 Sistema
- **Health Check**: Verificação de status da API
- **API Status**: Status geral da aplicação

## 🔑 Autenticação

### Fluxo de Autenticação:
1. **Registrar** um usuário (ou usar usuário existente)
2. **Fazer Login** para obter o token JWT
3. O token será automaticamente salvo na variável `{{token}}`
4. Todas as rotas protegidas usarão automaticamente o token

### Rotas Protegidas:
- Todas as operações de CRUD (Create, Update, Delete)
- Upload de arquivos
- Gerenciamento de usuários
- Atualização de configurações

## 📝 Exemplos de Uso

### 1. Login e Obtenção do Token
```json
POST /api/auth/login
{
  "email": "admin@imobiliaria.com",
  "password": "123456"
}
```

### 2. Criar uma Propriedade
```json
POST /api/properties
{
  "titulo": "Casa com 3 quartos no centro",
  "descricao": "Excelente casa com 3 quartos, 2 banheiros...",
  "tipo": "Casa",
  "finalidade": "Venda",
  "valor": 350000.00,
  "bairro": "Centro",
  "cidade": "São Paulo",
  "area_util": 120.50,
  "quartos": 3,
  "banheiros": 2,
  "vagas": 2,
  "imagens": ["/uploads/imagem1.jpg"],
  "status": "ativo"
}
```

### 3. Listar Propriedades com Filtros
```
GET /api/properties?status=ativo&tipo=Casa&finalidade=Venda&valorMin=100000&valorMax=500000
```

## 🎯 Filtros Disponíveis

### Propriedades:
- `page`, `limit`: Paginação
- `status`: ativo, inativo, vendido, alugado
- `tipo`: Casa, Apartamento, Cobertura, etc.
- `finalidade`: Venda, Aluguel
- `cidade`, `bairro`: Localização
- `valorMin`, `valorMax`: Faixa de preço
- `quartos`, `banheiros`, `vagas`: Características
- `destaque`: true/false

### Cidades:
- `page`, `limit`: Paginação
- `estado`: UF (ex: SP, RJ, MG)
- `ativo`: true/false

### Bairros:
- `page`, `limit`: Paginação
- `cidade_id`: ID da cidade
- `ativo`: true/false

### Tipos de Imóvel:
- `page`, `limit`: Paginação
- `categoria`: residencial, comercial, rural, terreno
- `ativo`: true/false

## 🔧 Configuração do Servidor

Certifique-se de que o servidor está rodando na porta configurada (padrão: 3001):

```bash
cd back
npm run dev
```

## 📋 Status Codes

- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Erro de validação
- `401`: Não autorizado
- `403`: Acesso negado
- `404`: Não encontrado
- `500`: Erro interno do servidor

## 🐛 Troubleshooting

### Problemas Comuns:

1. **Token Expirado**: Faça login novamente
2. **CORS Error**: Verifique se o servidor está rodando
3. **404 Not Found**: Verifique a URL e se o servidor está ativo
4. **401 Unauthorized**: Verifique se o token está sendo enviado

### Logs do Servidor:
Monitore os logs do servidor para identificar problemas:
```bash
npm run dev
```

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs do servidor
- Consulte a documentação da API
- Teste as rotas uma por uma
- Verifique as variáveis do environment

---

**Desenvolvido para Imobiliária Vagner & Luiz** 🏠
