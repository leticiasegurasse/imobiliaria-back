import express from 'express';
import {
  getSettings,
  updateSettings,
  getSettingsSection,
  updateSettingsSection
} from '../controllers/settings.controller';
import { authenticateToken } from '../middlewares/authMiddleware';
import asyncHandler from '../middlewares/asyncMiddleware';
// import { validateSettingsUpdate, handleValidationErrors } from '../middlewares/settingsValidationMiddleware';

const router = express.Router();

// Rotas públicas (não requerem autenticação)
router.get('/', asyncHandler(getSettings));
router.get('/section/:section', asyncHandler(getSettingsSection));

// Rotas protegidas (requerem autenticação)
router.put('/', authenticateToken, asyncHandler(updateSettings));
router.put('/section/:section', authenticateToken, asyncHandler(updateSettingsSection));

export default router;
