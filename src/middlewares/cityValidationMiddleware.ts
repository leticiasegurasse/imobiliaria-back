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

// Validações para criação de cidade
export const validateCreateCity = [
  body('nome')
    .notEmpty()
    .withMessage('Nome da cidade é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome da cidade deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('estado')
    .notEmpty()
    .withMessage('Estado é obrigatório')
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter exatamente 2 caracteres (UF)')
    .isUppercase()
    .withMessage('Estado deve estar em maiúsculas')
    .trim(),
  
  body('cep')
    .notEmpty()
    .withMessage('CEP é obrigatório')
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP deve estar no formato 00000-000'),
  
  body('ativo')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um valor booleano'),
  
  handleValidationErrors
];

// Validações para atualização de cidade
export const validateUpdateCity = [
  param('id')
    .isUUID()
    .withMessage('ID inválido'),
  
  body('nome')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome da cidade deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('estado')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter exatamente 2 caracteres (UF)')
    .isUppercase()
    .withMessage('Estado deve estar em maiúsculas')
    .trim(),
  
  body('cep')
    .optional()
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP deve estar no formato 00000-000'),
  
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
export const validateCityFilters = [
  query('search')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Termo de busca deve ter entre 1 e 255 caracteres')
    .trim(),
  
  query('estado')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter exatamente 2 caracteres (UF)')
    .isUppercase()
    .withMessage('Estado deve estar em maiúsculas')
    .trim(),
  
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
    .isIn(['nome', 'estado', 'createdAt', 'updatedAt'])
    .withMessage('Campo de ordenação inválido'),
  
  query('orderDirection')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Direção de ordenação deve ser ASC ou DESC'),
  
  handleValidationErrors
];

// Validação para parâmetro de estado
export const validateStateParam = [
  param('estado')
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter exatamente 2 caracteres (UF)')
    .isUppercase()
    .withMessage('Estado deve estar em maiúsculas')
    .trim(),
  
  query('ativo')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser um valor booleano'),
  
  handleValidationErrors
];
