const authService = require('../services/authService');

async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                sucess: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        const user = await authService.login(email, password);

        if (!user) {
            return res.status(401).json({
                sucess: false,
                message: 'Email ou senha inválidos'
            });
        }

        return res.status(200).json({
            sucess: true,
            message: 'Login realizado com sucesso',
            user,
        });
    } catch (error) {
        return res.status(500).json({
            sucess: false,
            message: 'Erro ao realizar login',
            error: error.message
        });
    }
}

async function registerController(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                sucess: false,
                message: 'Nome, email e senha são obrigatórios'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                sucess: false,
                message: 'Senha deve ter pelo menos 8 caracteres'
            });
        }

        if (!/\d/.test(password)) {
            return res.status(400).json({
                sucess: false,
                message: 'Senha deve conter pelo menos um número'
            });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({
                sucess: false,
                message: 'Senha deve conter pelo menos uma letra maiúscula'
            });
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({
                sucess: false,
                message: 'Senha deve conter pelo menos um caractere especial'
            });
        }

        if (await authService.existEmail(email)) {
            return res.status(400).json({
                sucess: false,
                message: 'Email já cadastrado'
            });
        }

        const user = await authService.register(name, email, password);

        if (!user) {
            return res.status(500).json({
                sucess: false,
                message: 'Erro ao registrar usuário'
            });
        }

        return res.status(201).json({
            sucess: true,
            message: 'Usuário registrado com sucesso',
            user
        });
    } catch (error) {
        return res.status(500).json({
            sucess: false,
            message: 'Erro ao registrar usuário',
            error: error.message
        });
    }
}

module.exports = {
    login: loginController,
    register: registerController
};