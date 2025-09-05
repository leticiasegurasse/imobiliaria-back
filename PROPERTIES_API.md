# API de Propriedades - Documentação

## Visão Geral

A API de Propriedades permite gerenciar o portfólio de imóveis da imobiliária, incluindo operações CRUD completas, filtros avançados e funcionalidades específicas como destaque e imóvel do mês.

## Endpoints

### 🔍 Consultas (Públicas)

#### Listar Propriedades
```
GET /api/properties
```

**Parâmetros de Query:**
- `search` (string): Busca por título, descrição, bairro ou cidade
- `status` (string): Filtrar por status (`ativo`, `inativo`, `vendido`, `alugado`)
- `tipo` (string): Filtrar por tipo de imóvel
- `finalidade` (string): Filtrar por finalidade (`Venda`, `Aluguel`)
- `cidade` (string): Filtrar por cidade
- `bairro` (string): Filtrar por bairro
- `minValor` (number): Valor mínimo
- `maxValor` (number): Valor máximo
- `minArea` (number): Área mínima
- `maxArea` (number): Área máxima
- `quartos` (number): Número de quartos
- `banheiros` (number): Número de banheiros
- `vagas` (number): Número de vagas
- `destaque` (boolean): Filtrar por destaque
- `imovel_do_mes` (boolean): Filtrar por imóvel do mês
- `page` (number): Página (padrão: 1)
- `limit` (number): Limite por página (padrão: 10, máx: 100)
- `orderBy` (string): Campo de ordenação
- `orderDirection` (string): Direção (`ASC`, `DESC`)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "properties": [...],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    },
    "stats": {
      "byStatus": [...],
      "totalDestaques": 5,
      "totalImoveisDoMes": 1
    }
  }
}
```

#### Buscar Propriedade por ID
```
GET /api/properties/:id
```

#### Propriedades em Destaque
```
GET /api/properties/featured?limit=6
```

#### Imóvel do Mês
```
GET /api/properties/property-of-month
```

### ✏️ Gerenciamento (Protegido - Requer Autenticação)

#### Criar Propriedade
```
POST /api/properties
```

**Body:**
```json
{
  "titulo": "Casa ampla com piscina",
  "descricao": "Casa espaçosa com área de lazer completa...",
  "tipo": "Casa",
  "finalidade": "Venda",
  "valor": 850000,
  "bairro": "Centro",
  "cidade": "Miracema",
  "area_util": 250,
  "quartos": 4,
  "banheiros": 3,
  "vagas": 2,
  "imagens": ["/uploads/casa1-1.jpg", "/uploads/casa1-2.jpg"],
  "destaque": true,
  "imovel_do_mes": false,
  "status": "ativo"
}
```

#### Atualizar Propriedade
```
PUT /api/properties/:id
```

**Body:** Mesmo formato da criação, mas todos os campos são opcionais.

#### Excluir Propriedade
```
DELETE /api/properties/:id
```

### 🔄 Ações Específicas (Protegido)

#### Toggle Status
```
PATCH /api/properties/:id/toggle-status
```
Alterna entre `ativo` e `inativo`.

#### Toggle Destaque
```
PATCH /api/properties/:id/toggle-featured
```
Alterna o status de destaque.

#### Toggle Imóvel do Mês
```
PATCH /api/properties/:id/toggle-property-of-month
```
Alterna o status de imóvel do mês.

## Estrutura de Dados

### Property
```typescript
interface Property {
  id: string;                    // UUID
  titulo: string;                // 3-255 caracteres
  descricao: string;             // 10-2000 caracteres
  tipo: string;                  // Casa, Apartamento, Cobertura, etc.
  finalidade: 'Venda' | 'Aluguel';
  valor: number;                 // Decimal (12,2)
  bairro: string;                // 2-100 caracteres
  cidade: string;                // 2-100 caracteres
  area_util: number;             // Decimal (8,2)
  quartos: number;               // 0-20
  banheiros: number;             // 1-20
  vagas: number;                 // 0-20
  imagens: string[];             // Array de URLs
  destaque: boolean;
  imovel_do_mes: boolean;
  status: 'ativo' | 'inativo' | 'vendido' | 'alugado';
  createdAt: Date;
  updatedAt: Date;
}
```

## Validações

### Criação
- Todos os campos são obrigatórios
- `imagens` deve ter pelo menos 1 item
- `banheiros` deve ser pelo menos 1
- `valor` e `area_util` devem ser maiores que 0

### Atualização
- Todos os campos são opcionais
- Validações aplicadas apenas aos campos fornecidos

### Filtros
- Validação de tipos e ranges para parâmetros numéricos
- Validação de enums para campos específicos

## Códigos de Resposta

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `404` - Propriedade não encontrada
- `500` - Erro interno do servidor

## Exemplos de Uso

### Buscar propriedades com filtros
```bash
GET /api/properties?search=casa&tipo=Casa&finalidade=Venda&minValor=500000&maxValor=1000000&page=1&limit=10
```

### Criar nova propriedade
```bash
POST /api/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Apartamento moderno",
  "descricao": "Apartamento com vista panorâmica...",
  "tipo": "Apartamento",
  "finalidade": "Aluguel",
  "valor": 2200,
  "bairro": "São José",
  "cidade": "Miracema",
  "area_util": 80,
  "quartos": 2,
  "banheiros": 2,
  "vagas": 1,
  "imagens": ["/uploads/apt1-1.jpg"],
  "destaque": true,
  "status": "ativo"
}
```

### Alternar destaque
```bash
PATCH /api/properties/123e4567-e89b-12d3-a456-426614174000/toggle-featured
Authorization: Bearer <token>
```

### Alternar imóvel do mês (com validação)
```bash
PATCH /api/properties/123e4567-e89b-12d3-a456-426614174000/toggle-property-of-month
Authorization: Bearer <token>
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "message": "Imóvel do mês ativado",
  "data": { "imovel_do_mes": true }
}
```

**Resposta de Erro (quando já existe outro imóvel do mês):**
```json
{
  "success": false,
  "message": "Já existe um imóvel do mês cadastrado",
  "details": {
    "existingProperty": {
      "id": "456e7890-e89b-12d3-a456-426614174001",
      "titulo": "Apartamento moderno com vista panorâmica"
    }
  }
}
```

## Validações Especiais

### Imóvel do Mês
- **Regra**: Apenas um imóvel pode ser marcado como "imóvel do mês" por vez
- **Comportamento**: Ao tentar marcar outro imóvel como "imóvel do mês", a API retorna erro com informações do imóvel atual
- **Resposta de Erro**:
```json
{
  "success": false,
  "message": "Já existe um imóvel do mês cadastrado",
  "details": {
    "existingProperty": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "titulo": "Casa ampla com piscina no centro"
    }
  }
}
```

## Notas Importantes

1. **Autenticação**: Endpoints de criação, atualização e exclusão requerem token JWT válido
2. **Imagens**: URLs devem apontar para arquivos válidos no sistema de upload
3. **Paginação**: Use `page` e `limit` para controlar a paginação
4. **Filtros**: Combine múltiplos filtros para busca refinada
5. **Validação**: Todos os dados são validados tanto no frontend quanto no backend
6. **Performance**: Índices otimizados para consultas frequentes por status, tipo, cidade, etc.
7. **Imóvel do Mês**: Apenas um imóvel pode ser marcado como "imóvel do mês" por vez
