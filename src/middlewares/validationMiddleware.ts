import { Request, Response, NextFunction } from 'express';

// Validação para registro de usuário
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email } = req.body;

    // Validar username
    if (!username || username.length < 3 || username.length > 50) {
        res.status(400).json({
            success: false,
            message: 'Username deve ter entre 3 e 50 caracteres'
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

    // Validar email (opcional, mas se fornecido deve ser válido)
    if (email && !isValidEmail(email)) {
        res.status(400).json({
            success: false,
            message: 'Email inválido'
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

// Funções auxiliares de validação
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
