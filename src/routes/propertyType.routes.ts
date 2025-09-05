import express from 'express';
import {
  getAllPropertyTypes,
  getPropertyTypeById,
  createPropertyType,
  updatePropertyType,
  deletePropertyType,
  togglePropertyTypeStatus,
  getPropertyTypesByCategory,
  getAvailableCategories
} from '../controllers/propertyType.controller';
import { authenticateToken } from '../middlewares/authMiddleware';
import asyncHandler from '../middlewares/asyncMiddleware';
import {
  validateCreatePropertyType,
  validateUpdatePropertyType,
  validateId,
  validatePropertyTypeFilters,
  validateCategoryParam
} from '../middlewares/propertyTypeValidationMiddleware';

const router = express.Router();

// Rotas públicas (não requerem autenticação)
router.get('/', ...validatePropertyTypeFilters, asyncHandler(getAllPropertyTypes));
router.get('/categories', asyncHandler(getAvailableCategories));
router.get('/category/:categoria', ...validateCategoryParam, asyncHandler(getPropertyTypesByCategory));
router.get('/:id', ...validateId, asyncHandler(getPropertyTypeById));

// Rotas protegidas (requerem autenticação)
router.use(authenticateToken);

// CRUD de tipos de imóvel
router.post('/', ...validateCreatePropertyType, asyncHandler(createPropertyType));
router.put('/:id', ...validateUpdatePropertyType, asyncHandler(updatePropertyType));
router.delete('/:id', ...validateId, asyncHandler(deletePropertyType));

// Ações específicas
router.patch('/:id/toggle-status', ...validateId, asyncHandler(togglePropertyTypeStatus));

export default router;
