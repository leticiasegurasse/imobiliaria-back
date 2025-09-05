import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

// Middleware para tratar erros de validação
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array().map(error => ({
        field: error.type === 'field' ? (error as any).path : (error as any).param,
        message: error.msg,
        value: error.type === 'field' ? (error as any).value : undefined
      }))
    });
    return;
  }
  next();
};

// Validações para criação de tipo de imóvel
export const validateCreatePropertyType = [
  body('nome')
    .notEmpty()
    .withMessage('Nome do tipo de imóvel é obrigatório')
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome do tipo de imóvel deve ter entre 2 e 50 caracteres')
    .trim(),
  
  body('descricao')
    .optional()
    .isLength({ min: 0, max: 500 })
    .withMessage('Descrição deve ter no máximo 500 caracteres')
    .trim(),
  
  body('categoria')
    .notEmpty()
    .withMessage('Categoria é obrigatória')
    .isIn(['residencial', 'comercial', 'rural', 'terreno'])
    .withMessage('Categoria deve ser: residencial, comercial, rural ou terreno'),
  
  body('ativo')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um valor booleano'),
  
  handleValidationErrors
];

// Validações para atualização de tipo de imóvel
export const validateUpdatePropertyType = [
  param('id')
    .isUUID()
    .withMessage('ID inválido'),
  
  body('nome')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nome do tipo de imóvel deve ter entre 2 e 50 caracteres')
    .trim(),
  
  body('descricao')
    .optional()
    .isLength({ min: 0, max: 500 })
    .withMessage('Descrição deve ter no máximo 500 caracteres')
    .trim(),
  
  body('categoria')
    .optional()
    .isIn(['residencial', 'comercial', 'rural', 'terreno'])
    .withMessage('Categoria deve ser: residencial, comercial, rural ou terreno'),
  
  body('ativo')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um valor booleano'),
  
  handleValidationErrors
];

// Validações para parâmetros de ID
export const validateId = [
  param('id')
    .isUUID()
    .withMessage('ID inválido'),
  
  handleValidationErrors
];

// Validações para filtros de busca
export const validatePropertyTypeFilters = [
  query('search')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Termo de busca deve ter entre 1 e 255 caracteres')
    .trim(),
  
  query('categoria')
    .optional()
    .isIn(['residencial', 'comercial', 'rural', 'terreno'])
    .withMessage('Categoria deve ser: residencial, comercial, rural ou terreno'),
  
  query('ativo')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um valor booleano'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro maior que 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser um número entre 1 e 100'),
  
  query('orderBy')
    .optional()
    .isIn(['nome', 'categoria', 'createdAt', 'updatedAt'])
    .withMessage('Campo de ordenação inválido'),
  
  query('orderDirection')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Direção de ordenação deve ser ASC ou DESC'),
  
  handleValidationErrors
];

// Validação para parâmetro de categoria
export const validateCategoryParam = [
  param('categoria')
    .isIn(['residencial', 'comercial', 'rural', 'terreno'])
    .withMessage('Categoria deve ser: residencial, comercial, rural ou terreno'),
  
  query('ativo')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um valor booleano'),
  
  handleValidationErrors
];
