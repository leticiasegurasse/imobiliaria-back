import { Request, Response, NextFunction } from 'express';

// Validação para registro de usuário
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { username, email, fullName, accessLevel, password } = req.body;

    // Validar username
    if (!username || username.length < 3 || username.length > 50) {
        res.status(400).json({
            success: false,
            message: 'Username deve ter entre 3 e 50 caracteres'
        });
        return;
    }

    // Validar email
    if (!email || !isValidEmail(email)) {
        res.status(400).json({
            success: false,
            message: 'Email válido é obrigatório'
        });
        return;
    }

    // Validar nome completo
    if (!fullName || fullName.length < 2 || fullName.length > 100) {
        res.status(400).json({
            success: false,
            message: 'Nome completo deve ter entre 2 e 100 caracteres'
        });
        return;
    }

    // Validar nível de acesso
    if (accessLevel && !['admin', 'editor'].includes(accessLevel)) {
        res.status(400).json({
            success: false,
            message: 'Nível de acesso deve ser "admin" ou "editor"'
        });
        return;
    }

    // Validar password
    if (!password || password.length < 6) {
        res.status(400).json({
            success: false,
            message: 'Senha deve ter pelo menos 6 caracteres'
        });
        return;
    }

    next();
};

// Validação para login
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({
            success: false,
            message: 'Username e password são obrigatórios'
        });
        return;
    }

    next();
};

// Validação para atualização de perfil
export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
    const { username, email, fullName, accessLevel } = req.body;

    // Validar username (se fornecido)
    if (username && (username.length < 3 || username.length > 50)) {
        res.status(400).json({
            success: false,
            message: 'Username deve ter entre 3 e 50 caracteres'
        });
        return;
    }

    // Validar email (se fornecido)
    if (email && !isValidEmail(email)) {
        res.status(400).json({
            success: false,
            message: 'Email inválido'
        });
        return;
    }

    // Validar nome completo (se fornecido)
    if (fullName && (fullName.length < 2 || fullName.length > 100)) {
        res.status(400).json({
            success: false,
            message: 'Nome completo deve ter entre 2 e 100 caracteres'
        });
        return;
    }

    // Validar nível de acesso (se fornecido)
    if (accessLevel && !['admin', 'editor'].includes(accessLevel)) {
        res.status(400).json({
            success: false,
            message: 'Nível de acesso deve ser "admin" ou "editor"'
        });
        return;
    }

    next();
};

// Funções auxiliares de validação
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
