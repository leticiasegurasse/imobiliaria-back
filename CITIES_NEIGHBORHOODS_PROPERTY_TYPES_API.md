# API de Cidades, Bairros e Tipos de Imóvel

Esta documentação descreve os endpoints para gerenciar cidades, bairros e tipos de imóvel no sistema.

## 🏙️ Cidades

### Endpoints Públicos

#### GET /api/cities
Lista todas as cidades com filtros e paginação.

**Query Parameters:**
- `search` (string, opcional): Busca por nome ou estado
- `estado` (string, opcional): Filtrar por estado (UF)
- `ativo` (boolean, opcional): Filtrar por status ativo
- `page` (number, opcional): Página (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 10)
- `orderBy` (string, opcional): Campo para ordenação (nome, estado, createdAt, updatedAt)
- `orderDirection` (string, opcional): Direção da ordenação (ASC, DESC)

**Exemplo de resposta:**
```json
{
  "success": true,
  "data": {
    "cities": [
      {
        "id": "uuid",
        "nome": "São Paulo",
        "estado": "SP",
        "cep": "01000-000",
        "ativo": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

#### GET /api/cities/state/:estado
Lista cidades por estado.

**Parâmetros:**
- `estado` (string): UF do estado (ex: SP, RJ)

**Query Parameters:**
- `ativo` (boolean, opcional): Filtrar por status ativo

#### GET /api/cities/:id
Busca uma cidade por ID.

### Endpoints Protegidos (Requerem autenticação)

#### POST /api/cities
Cria uma nova cidade.

**Body:**
```json
{
  "nome": "São Paulo",
  "estado": "SP",
  "cep": "01000-000",
  "ativo": true
}
```

#### PUT /api/cities/:id
Atualiza uma cidade existente.

#### DELETE /api/cities/:id
Exclui uma cidade.

#### PATCH /api/cities/:id/toggle-status
Alterna o status ativo/inativo da cidade.

## 🏘️ Bairros

### Endpoints Públicos

#### GET /api/neighborhoods
Lista todos os bairros com filtros e paginação.

**Query Parameters:**
- `search` (string, opcional): Busca por nome
- `cidade_id` (string, opcional): Filtrar por cidade
- `ativo` (boolean, opcional): Filtrar por status ativo
- `page` (number, opcional): Página (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 10)
- `orderBy` (string, opcional): Campo para ordenação (nome, createdAt, updatedAt)
- `orderDirection` (string, opcional): Direção da ordenação (ASC, DESC)

**Exemplo de resposta:**
```json
{
  "success": true,
  "data": {
    "neighborhoods": [
      {
        "id": "uuid",
        "nome": "Centro",
        "cidade_id": "uuid",
        "ativo": true,
        "cidade": {
          "id": "uuid",
          "nome": "São Paulo",
          "estado": "SP"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

#### GET /api/neighborhoods/city/:cidade_id
Lista bairros por cidade.

**Parâmetros:**
- `cidade_id` (string): ID da cidade

**Query Parameters:**
- `ativo` (boolean, opcional): Filtrar por status ativo

#### GET /api/neighborhoods/:id
Busca um bairro por ID.

### Endpoints Protegidos (Requerem autenticação)

#### POST /api/neighborhoods
Cria um novo bairro.

**Body:**
```json
{
  "nome": "Centro",
  "cidade_id": "uuid",
  "ativo": true
}
```

#### PUT /api/neighborhoods/:id
Atualiza um bairro existente.

#### DELETE /api/neighborhoods/:id
Exclui um bairro.

#### PATCH /api/neighborhoods/:id/toggle-status
Alterna o status ativo/inativo do bairro.

## 🏢 Tipos de Imóvel

### Endpoints Públicos

#### GET /api/property-types
Lista todos os tipos de imóvel com filtros e paginação.

**Query Parameters:**
- `search` (string, opcional): Busca por nome ou descrição
- `categoria` (string, opcional): Filtrar por categoria (residencial, comercial, rural, terreno)
- `ativo` (boolean, opcional): Filtrar por status ativo
- `page` (number, opcional): Página (padrão: 1)
- `limit` (number, opcional): Itens por página (padrão: 10)
- `orderBy` (string, opcional): Campo para ordenação (nome, categoria, createdAt, updatedAt)
- `orderDirection` (string, opcional): Direção da ordenação (ASC, DESC)

**Exemplo de resposta:**
```json
{
  "success": true,
  "data": {
    "propertyTypes": [
      {
        "id": "uuid",
        "nome": "Apartamento",
        "descricao": "Unidade habitacional em edifício",
        "categoria": "residencial",
        "ativo": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

#### GET /api/property-types/categories
Lista as categorias disponíveis.

**Exemplo de resposta:**
```json
{
  "success": true,
  "data": [
    { "value": "residencial", "label": "Residencial" },
    { "value": "comercial", "label": "Comercial" },
    { "value": "rural", "label": "Rural" },
    { "value": "terreno", "label": "Terreno" }
  ]
}
```

#### GET /api/property-types/category/:categoria
Lista tipos de imóvel por categoria.

**Parâmetros:**
- `categoria` (string): Categoria (residencial, comercial, rural, terreno)

**Query Parameters:**
- `ativo` (boolean, opcional): Filtrar por status ativo

#### GET /api/property-types/:id
Busca um tipo de imóvel por ID.

### Endpoints Protegidos (Requerem autenticação)

#### POST /api/property-types
Cria um novo tipo de imóvel.

**Body:**
```json
{
  "nome": "Apartamento",
  "descricao": "Unidade habitacional em edifício",
  "categoria": "residencial",
  "ativo": true
}
```

#### PUT /api/property-types/:id
Atualiza um tipo de imóvel existente.

#### DELETE /api/property-types/:id
Exclui um tipo de imóvel.

#### PATCH /api/property-types/:id/toggle-status
Alterna o status ativo/inativo do tipo de imóvel.

## 🔐 Autenticação

Todos os endpoints protegidos requerem um token de autenticação no header:

```
Authorization: Bearer <token>
```

## 📝 Validações

### Cidade
- **nome**: Obrigatório, 2-100 caracteres
- **estado**: Obrigatório, exatamente 2 caracteres (UF), maiúsculas
- **cep**: Obrigatório, formato 00000-000
- **ativo**: Opcional, boolean

### Bairro
- **nome**: Obrigatório, 2-100 caracteres
- **cidade_id**: Obrigatório, UUID válido
- **ativo**: Opcional, boolean

### Tipo de Imóvel
- **nome**: Obrigatório, 2-50 caracteres, único
- **descricao**: Opcional, máximo 500 caracteres
- **categoria**: Obrigatório, uma das opções: residencial, comercial, rural, terreno
- **ativo**: Opcional, boolean

## 🚨 Códigos de Erro

- **400**: Dados inválidos ou regras de negócio violadas
- **401**: Não autenticado
- **403**: Não autorizado
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## 📊 Relacionamentos

- **Cidade** → **Bairro**: Uma cidade pode ter vários bairros
- **Bairro** → **Cidade**: Um bairro pertence a uma cidade
- **Tipo de Imóvel**: Independente, sem relacionamentos obrigatórios

## 🔄 Status

Todos os recursos possuem um campo `ativo` que pode ser alternado entre `true` e `false` para controle de disponibilidade sem exclusão física dos dados.
