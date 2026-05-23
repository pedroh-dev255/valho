const userServices = require('../services/userService');

async function inviteController(req, res) {
    try {
        const { email } = req.body;
        const institutionId = req.user.institution_id;
        const createdBy = req.user.id;

        if (!email || !institutionId) {
            return res.status(400).json({
                success: false,
                message: 'Email e instituição são obrigatórios'
            });
        }

        const invite = await userServices.createInvite(email, institutionId, createdBy);

        if (!invite) {
            return res.status(500).json({
                success: false,
                message: 'Erro ao criar convite'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Convite enviado com sucesso',
            invite
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao criar convite',
            error: error.message
        });
    }
}

async function getUsers(req, res) {
    try {
        const institutionId = req.user.institution_id;

        if (!institutionId) {
            return res.status(400).json({
                success: false,
                message: 'Instituição é obrigatória'
            });
        }
        const users = await userServices.getUsersByInstitution(institutionId);

        return res.status(200).json({
            success: true,
            message: 'Usuários obtidos com sucesso',
            total_active: users.total_active,
            total_admin: users.total_admin,
            total_pending: users.total_pending,
            users: users.users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao obter usuários',
            error: error.message
        });
    }
}

module.exports = {
    invite: inviteController,
    getUsers
};