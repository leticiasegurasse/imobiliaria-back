import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePropertyStatus,
  togglePropertyFeatured,
  togglePropertyOfMonth,
  getFeaturedProperties,
  getPropertyOfMonth
} from '../controllers/property.controller';
import { authenticateToken } from '../middlewares/authMiddleware';
import asyncHandler from '../middlewares/asyncMiddleware';
import {
  validateCreateProperty,
  validateUpdateProperty,
  validateId,
  validatePropertyFilters
} from '../middlewares/propertyValidationMiddleware';

const router = express.Router();

// Rotas públicas (não requerem autenticação)
router.get('/', ...validatePropertyFilters, asyncHandler(getAllProperties));
router.get('/featured', asyncHandler(getFeaturedProperties));
router.get('/property-of-month', asyncHandler(getPropertyOfMonth));
router.get('/:id', ...validateId, asyncHandler(getPropertyById));

// Rotas protegidas (requerem autenticação)
router.use(authenticateToken);

// CRUD de propriedades
router.post('/', ...validateCreateProperty, asyncHandler(createProperty));
router.put('/:id', ...validateUpdateProperty, asyncHandler(updateProperty));
router.delete('/:id', ...validateId, asyncHandler(deleteProperty));

// Ações específicas
router.patch('/:id/toggle-status', ...validateId, asyncHandler(togglePropertyStatus));
router.patch('/:id/toggle-featured', ...validateId, asyncHandler(togglePropertyFeatured));
router.patch('/:id/toggle-property-of-month', ...validateId, asyncHandler(togglePropertyOfMonth));

export default router;
