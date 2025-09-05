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

// Validações para criação de bairro
export const validateCreateNeighborhood = [
  body('nome')
    .notEmpty()
    .withMessage('Nome do bairro é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome do bairro deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('cidade_id')
    .notEmpty()
    .withMessage('ID da cidade é obrigatório')
    .isUUID()
    .withMessage('ID da cidade deve ser um UUID válido'),
  
  body('ativo')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um valor booleano'),
  
  handleValidationErrors
];

// Validações para atualização de bairro
export const validateUpdateNeighborhood = [
  param('id')
    .isUUID()
    .withMessage('ID inválido'),
  
  body('nome')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome do bairro deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('cidade_id')
    .optional()
    .isUUID()
    .withMessage('ID da cidade deve ser um UUID válido'),
  
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
export const validateNeighborhoodFilters = [
  query('search')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Termo de busca deve ter entre 1 e 255 caracteres')
    .trim(),
  
  query('cidade_id')
    .optional()
    .isUUID()
    .withMessage('ID da cidade deve ser um UUID válido'),
  
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
    .isIn(['nome', 'createdAt', 'updatedAt'])
    .withMessage('Campo de ordenação inválido'),
  
  query('orderDirection')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Direção de ordenação deve ser ASC ou DESC'),
  
  handleValidationErrors
];

// Validação para parâmetro de cidade_id
export const validateCityIdParam = [
  param('cidade_id')
    .isUUID()
    .withMessage('ID da cidade deve ser um UUID válido'),
  
  query('ativo')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um valor booleano'),
  
  handleValidationErrors
];
