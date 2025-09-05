import express from 'express';
import {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
  toggleCityStatus,
  getCitiesByState
} from '../controllers/city.controller';
import { authenticateToken } from '../middlewares/authMiddleware';
import asyncHandler from '../middlewares/asyncMiddleware';
import {
  validateCreateCity,
  validateUpdateCity,
  validateId,
  validateCityFilters,
  validateStateParam
} from '../middlewares/cityValidationMiddleware';

const router = express.Router();

// Rotas públicas (não requerem autenticação)
router.get('/', ...validateCityFilters, asyncHandler(getAllCities));
router.get('/state/:estado', ...validateStateParam, asyncHandler(getCitiesByState));
router.get('/:id', ...validateId, asyncHandler(getCityById));

// Rotas protegidas (requerem autenticação)
router.use(authenticateToken);

// CRUD de cidades
router.post('/', ...validateCreateCity, asyncHandler(createCity));
router.put('/:id', ...validateUpdateCity, asyncHandler(updateCity));
router.delete('/:id', ...validateId, asyncHandler(deleteCity));

// Ações específicas
router.patch('/:id/toggle-status', ...validateId, asyncHandler(toggleCityStatus));

export default router;
