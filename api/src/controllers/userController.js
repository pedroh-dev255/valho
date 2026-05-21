const userServices = require('../services/userService');

async function inviteController(req, res) {
    try {
        const { email } = req.body;
        const institutionId = req.user.institution_id;
        const createdBy = req.user.id;

        if (!email || !institutionId) {
            return res.status(400).json({
                sucess: false,
                message: 'Email e instituição são obrigatórios'
            });
        }

        const invite = await userServices.createInvite(email, institutionId, createdBy);

        if (!invite) {
            return res.status(500).json({
                sucess: false,
                message: 'Erro ao criar convite'
            });
        }

        return res.status(201).json({
            sucess: true,
            message: 'Convite enviado com sucesso',
            invite
        });
    } catch (error) {
        return res.status(500).json({
            sucess: false,
            message: 'Erro ao criar convite',
            error: error.message
        });
    }
}


module.exports = {
    invite: inviteController
};