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

// Validações para criação de propriedade
export const validateCreateProperty = [
  body('titulo')
    .notEmpty()
    .withMessage('Título é obrigatório')
    .isLength({ min: 3, max: 255 })
    .withMessage('Título deve ter entre 3 e 255 caracteres')
    .trim(),
  
  body('descricao')
    .notEmpty()
    .withMessage('Descrição é obrigatória')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Descrição deve ter entre 10 e 2000 caracteres')
    .trim(),
  
  body('tipo_id')
    .notEmpty()
    .withMessage('Tipo é obrigatório')
    .isUUID()
    .withMessage('Tipo deve ser um ID válido'),
  
  body('finalidade')
    .notEmpty()
    .withMessage('Finalidade é obrigatória')
    .isIn(['Venda', 'Aluguel'])
    .withMessage('Finalidade deve ser "Venda" ou "Aluguel"'),
  
  body('valor')
    .notEmpty()
    .withMessage('Valor é obrigatório')
    .isNumeric()
    .withMessage('Valor deve ser um número')
    .isFloat({ min: 0.01 })
    .withMessage('Valor deve ser maior que zero'),
  
  body('bairro')
    .notEmpty()
    .withMessage('Bairro é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Bairro deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('cidade')
    .notEmpty()
    .withMessage('Cidade é obrigatória')
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('area_util')
    .notEmpty()
    .withMessage('Área útil é obrigatória')
    .isNumeric()
    .withMessage('Área útil deve ser um número')
    .isFloat({ min: 0.01 })
    .withMessage('Área útil deve ser maior que zero'),
  
  body('quartos')
    .notEmpty()
    .withMessage('Número de quartos é obrigatório')
    .isInt({ min: 0, max: 20 })
    .withMessage('Número de quartos deve ser entre 0 e 20'),
  
  body('banheiros')
    .notEmpty()
    .withMessage('Número de banheiros é obrigatório')
    .isInt({ min: 1, max: 20 })
    .withMessage('Número de banheiros deve ser entre 1 e 20'),
  
  body('vagas')
    .notEmpty()
    .withMessage('Número de vagas é obrigatório')
    .isInt({ min: 0, max: 20 })
    .withMessage('Número de vagas deve ser entre 0 e 20'),
  
  body('imagens')
    .isArray({ min: 1 })
    .withMessage('Deve ser fornecida pelo menos uma imagem')
    .custom((value) => {
      if (!Array.isArray(value) || value.length === 0) {
        throw new Error('Deve ser fornecida pelo menos uma imagem');
      }
      // Validar se todas as imagens são strings (URLs ou data URLs)
      for (const image of value) {
        if (typeof image !== 'string' || image.trim() === '') {
          throw new Error('Todas as imagens devem ser URLs válidas');
        }
        // Aceitar tanto URLs quanto data URLs (base64)
        if (!image.startsWith('http') && !image.startsWith('data:image/')) {
          throw new Error('Todas as imagens devem ser URLs válidas ou data URLs');
        }
      }
      return true;
    }),
  
  body('destaque')
    .optional()
    .isBoolean()
    .withMessage('Destaque deve ser um valor booleano'),
  
  body('imovel_do_mes')
    .optional()
    .isBoolean()
    .withMessage('Imóvel do mês deve ser um valor booleano'),
  
  body('status')
    .optional()
    .isIn(['ativo', 'inativo', 'vendido', 'alugado'])
    .withMessage('Status inválido'),
  
  handleValidationErrors
];

// Validações para atualização de propriedade
export const validateUpdateProperty = [
  param('id')
    .isUUID()
    .withMessage('ID inválido'),
  
  body('titulo')
    .optional()
    .isLength({ min: 3, max: 255 })
    .withMessage('Título deve ter entre 3 e 255 caracteres')
    .trim(),
  
  body('descricao')
    .optional()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Descrição deve ter entre 10 e 2000 caracteres')
    .trim(),
  
  body('tipo')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Tipo deve ter entre 2 e 50 caracteres')
    .trim(),
  
  body('finalidade')
    .optional()
    .isIn(['Venda', 'Aluguel'])
    .withMessage('Finalidade deve ser "Venda" ou "Aluguel"'),
  
  body('valor')
    .optional()
    .isNumeric()
    .withMessage('Valor deve ser um número')
    .isFloat({ min: 0.01 })
    .withMessage('Valor deve ser maior que zero'),
  
  body('bairro')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Bairro deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('cidade')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('area_util')
    .optional()
    .isNumeric()
    .withMessage('Área útil deve ser um número')
    .isFloat({ min: 0.01 })
    .withMessage('Área útil deve ser maior que zero'),
  
  body('quartos')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Número de quartos deve ser entre 0 e 20'),
  
  body('banheiros')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Número de banheiros deve ser entre 1 e 20'),
  
  body('vagas')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Número de vagas deve ser entre 0 e 20'),
  
  body('imagens')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Deve ser fornecida pelo menos uma imagem')
    .custom((value) => {
      if (value && (!Array.isArray(value) || value.length === 0)) {
        throw new Error('Deve ser fornecida pelo menos uma imagem');
      }
      if (value) {
        // Validar se todas as imagens são strings (URLs ou data URLs)
        for (const image of value) {
          if (typeof image !== 'string' || image.trim() === '') {
            throw new Error('Todas as imagens devem ser URLs válidas');
          }
          // Aceitar tanto URLs quanto data URLs (base64)
          if (!image.startsWith('http') && !image.startsWith('data:image/')) {
            throw new Error('Todas as imagens devem ser URLs válidas ou data URLs');
          }
        }
      }
      return true;
    }),
  
  body('destaque')
    .optional()
    .isBoolean()
    .withMessage('Destaque deve ser um valor booleano'),
  
  body('imovel_do_mes')
    .optional()
    .isBoolean()
    .withMessage('Imóvel do mês deve ser um valor booleano'),
  
  body('status')
    .optional()
    .isIn(['ativo', 'inativo', 'vendido', 'alugado'])
    .withMessage('Status inválido'),
  
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
export const validatePropertyFilters = [
  query('search')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('Termo de busca deve ter entre 1 e 255 caracteres')
    .trim(),
  
  query('status')
    .optional()
    .isIn(['ativo', 'inativo', 'vendido', 'alugado'])
    .withMessage('Status inválido'),
  
  query('tipo')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tipo deve ter entre 1 e 50 caracteres'),
  
  query('finalidade')
    .optional()
    .isIn(['Venda', 'Aluguel'])
    .withMessage('Finalidade inválida'),
  
  query('cidade')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Cidade deve ter entre 2 e 100 caracteres')
    .trim(),
  
  query('bairro')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Bairro deve ter entre 2 e 100 caracteres')
    .trim(),
  
  query('minValor')
    .optional()
    .isNumeric()
    .withMessage('Valor mínimo deve ser um número')
    .isFloat({ min: 0 })
    .withMessage('Valor mínimo não pode ser negativo'),
  
  query('maxValor')
    .optional()
    .isNumeric()
    .withMessage('Valor máximo deve ser um número')
    .isFloat({ min: 0 })
    .withMessage('Valor máximo não pode ser negativo'),
  
  query('minArea')
    .optional()
    .isNumeric()
    .withMessage('Área mínima deve ser um número')
    .isFloat({ min: 0 })
    .withMessage('Área mínima não pode ser negativa'),
  
  query('maxArea')
    .optional()
    .isNumeric()
    .withMessage('Área máxima deve ser um número')
    .isFloat({ min: 0 })
    .withMessage('Área máxima não pode ser negativa'),
  
  query('quartos')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Número de quartos deve ser entre 0 e 20'),
  
  query('banheiros')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Número de banheiros deve ser entre 1 e 20'),
  
  query('vagas')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Número de vagas deve ser entre 0 e 20'),
  
  query('destaque')
    .optional()
    .isBoolean()
    .withMessage('Destaque deve ser um valor booleano'),
  
  query('imovel_do_mes')
    .optional()
    .isBoolean()
    .withMessage('Imóvel do mês deve ser um valor booleano'),
  
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
    .isIn(['titulo', 'valor', 'area_util', 'createdAt', 'updatedAt'])
    .withMessage('Campo de ordenação inválido'),
  
  query('orderDirection')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Direção de ordenação deve ser ASC ou DESC'),
  
  handleValidationErrors
];
