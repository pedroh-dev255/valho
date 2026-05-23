// authController.js
const authService = require('../services/authService');
const userService = require('../services/userService');

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
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        if (!await authService.isUserActive(email)) {
            return res.status(401).json({
                success: false,
                message: 'Usuário inativo, entre em contato com o administrador para ativar sua conta'
            });
        }

        const user = await authService.login(email, password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha inválidos'
            });
        }



        return res.status(200).json({
            success: true,
            message: 'Login realizado com successo',
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
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
                success: false,
                message: 'Nome, convite, email e senha são obrigatórios'
            });
        }

        if (!validaPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Senha não atende aos requisitos de segurança: mínimo 8 caracteres, pelo menos um número, uma letra maiúscula e um caractere especial'
            });
        }

        if (await authService.existEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email já cadastrado'
            });
        }
        const inviteCheck = await authService.existInvite(invite);
        if (!inviteCheck.exists) {
            return res.status(400).json({
                success: false,
                message: 'Convite inválido'
            });
        }

        const user = await authService.register(name, inviteCheck.id, email, password);

        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao registrar usuário'
            });
        }

        await authService.useInvite(invite);

        return res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso',
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao registrar usuário',
            error: error.message
        });
    }
}

async function logout(req, res) {
    try {
        const userId = req.user.id;
        

        await authService.logout(userId);
        return res.status(200).json({
            success: true,
            message: 'Logout realizado com successo'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao realizar logout',
            error: error.message
        });
    }
}

async function resetPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email é obrigatório'
            });
        }

        if (!await authService.existEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email não encontrado'
            });
        }

        if (!await authService.isUserActive(email)) {
            return res.status(401).json({
                success: false,
                message: 'Usuário inativo, entre em contato com o administrador para ativar sua conta'
            });
        }

        const response = await userService.resetPassword(email);

        if (!response) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao enviar email de redefinição de senha'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Email de redefinição de senha enviado com successo'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao redefinir senha',
            error: error.message
        });
    }
}

async function confirmReset(req, res) {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Token e nova senha são obrigatórios'
            });
        }

        if (!validaPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Senha não atende aos requisitos de segurança: mínimo 8 caracteres, pelo menos um número, uma letra maiúscula e um caractere especial'
            });
        }


        const response = await userService.confirmReset(token, password);

        if (!response) {
            return res.status(400).json({
                success: false,
                message: 'Token inválido ou expirado'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Senha redefinida com successo'
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao confirmar redefinição de senha',
            error: error.message
        });
    }
}


module.exports = {
    login: loginController,
    register: registerController,
    logout,
    resetPassword,
    confirmReset
};