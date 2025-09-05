import express from 'express';
import {
  getAllNeighborhoods,
  getNeighborhoodById,
  createNeighborhood,
  updateNeighborhood,
  deleteNeighborhood,
  toggleNeighborhoodStatus,
  getNeighborhoodsByCity
} from '../controllers/neighborhood.controller';
import { authenticateToken } from '../middlewares/authMiddleware';
import asyncHandler from '../middlewares/asyncMiddleware';
import {
  validateCreateNeighborhood,
  validateUpdateNeighborhood,
  validateId,
  validateNeighborhoodFilters,
  validateCityIdParam
} from '../middlewares/neighborhoodValidationMiddleware';

const router = express.Router();

// Rotas públicas (não requerem autenticação)
router.get('/', ...validateNeighborhoodFilters, asyncHandler(getAllNeighborhoods));
router.get('/city/:cidade_id', ...validateCityIdParam, asyncHandler(getNeighborhoodsByCity));
router.get('/:id', ...validateId, asyncHandler(getNeighborhoodById));

// Rotas protegidas (requerem autenticação)
router.use(authenticateToken);

// CRUD de bairros
router.post('/', ...validateCreateNeighborhood, asyncHandler(createNeighborhood));
router.put('/:id', ...validateUpdateNeighborhood, asyncHandler(updateNeighborhood));
router.delete('/:id', ...validateId, asyncHandler(deleteNeighborhood));

// Ações específicas
router.patch('/:id/toggle-status', ...validateId, asyncHandler(toggleNeighborhoodStatus));

export default router;
