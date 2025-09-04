import { Router, Request, Response } from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser,
    refreshToken,
    verifyToken,
    forgotPassword,
    resetPassword,
    getProfile,
    updateProfile,
    changePassword,
    getAllUsers,
    createUserByAdmin,
    updateUserById,
    deleteUserById
} from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validateRegister, validateLogin, validateProfileUpdate } from '../middlewares/validationMiddleware';
import asyncMiddleware from '../middlewares/asyncMiddleware';

const authRoutes = Router();

// Rotas públicas com validação
authRoutes.post('/register', validateRegister, asyncMiddleware(registerUser));
authRoutes.post('/login', validateLogin, asyncMiddleware(loginUser));
authRoutes.post('/logout', asyncMiddleware(logoutUser));
authRoutes.post('/refresh', asyncMiddleware(refreshToken));
authRoutes.post('/forgot-password', asyncMiddleware(forgotPassword));
authRoutes.post('/reset-password', asyncMiddleware(resetPassword));

// Rotas protegidas (requerem autenticação)
authRoutes.get('/verify-token', authenticateToken, asyncMiddleware(verifyToken));
authRoutes.get('/profile', authenticateToken, asyncMiddleware(getProfile));
authRoutes.put('/profile', authenticateToken, validateProfileUpdate, asyncMiddleware(updateProfile));
authRoutes.post('/change-password', authenticateToken, asyncMiddleware(changePassword));

// Rotas de gerenciamento de usuários (apenas admin)
authRoutes.get('/profile/all', authenticateToken, asyncMiddleware(getAllUsers));
authRoutes.post('/profile/create', authenticateToken, validateRegister, asyncMiddleware(createUserByAdmin));
authRoutes.put('/profile/:id', authenticateToken, validateProfileUpdate, asyncMiddleware(updateUserById));
authRoutes.delete('/profile/:id', authenticateToken, asyncMiddleware(deleteUserById));

export default authRoutes;
