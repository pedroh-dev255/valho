// authController.js
const authService = require('../services/authService');

function validaPassword(password) {
    if (password.length < 8) {
        return false
    }
    if (!/\d/.test(password)) {
        return false
    }
    if (!/[A-Z]/.test(password)) {
        return false
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return false
    }
    return true;
}

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
        const { name, invite, email, password } = req.body;

        if (!name || !invite || !email || !password) {
            return res.status(400).json({
                sucess: false,
                message: 'Nome, convite, email e senha são obrigatórios'
            });
        }

        if (!validaPassword(password)) {
            return res.status(400).json({
                sucess: false,
                message: 'Senha não atende aos requisitos de segurança: mínimo 8 caracteres, pelo menos um número, uma letra maiúscula e um caractere especial'
            });
        }

        if (await authService.existEmail(email)) {
            return res.status(400).json({
                sucess: false,
                message: 'Email já cadastrado'
            });
        }
        const inviteCheck = await authService.existInvite(invite);
        if (!inviteCheck.exists) {
            return res.status(400).json({
                sucess: false,
                message: 'Convite inválido'
            });
        }

        const user = await authService.register(name, inviteCheck.id, email, password);

        if (!user) {
            return res.status(500).json({
                sucess: false,
                message: 'Erro ao registrar usuário'
            });
        }

        await authService.useInvite(invite);

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

async function resetPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                sucess: false,
                message: 'Email é obrigatório'
            });
        }

        if (!await authService.existEmail(email)) {
            return res.status(400).json({
                sucess: false,
                message: 'Email não encontrado'
            });
        }

        return res.status(200).json({
            sucess: true,
            message: 'Email de redefinição de senha enviado com sucesso'
        });

    } catch (error) {
        return res.status(500).json({
            sucess: false,
            message: 'Erro ao redefinir senha',
            error: error.message
        });
    }
}

async function confirmReset(req, res) {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                sucess: false,
                message: 'Token e nova senha são obrigatórios'
            });
        }

        if (!validaPassword(newPassword)) {
            return res.status(400).json({
                sucess: false,
                message: 'Senha não atende aos requisitos de segurança: mínimo 8 caracteres, pelo menos um número, uma letra maiúscula e um caractere especial'
            });
        }


    } catch (error) {
        return res.status(500).json({
            sucess: false,
            message: 'Erro ao confirmar redefinição de senha',
            error: error.message
        });
    }
}


module.exports = {
    login: loginController,
    register: registerController,
    resetPassword,
    confirmReset
};