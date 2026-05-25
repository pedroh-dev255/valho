const roleService = require('../services/roleService');

async function getRoles(req, res) {
    try {
        const institutionId = req.user.institution_id;

        if (!institutionId) {
            return res.status(400).json({
                success: false,
                message: 'Instituição é obrigatória'
            });
        }

        const roles = await roleService.getRoles(institutionId);
        return res.status(200).json({
            success: true,
            message: 'Papéis obtidos com sucesso',
            roles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao obter papéis',
            error: error.message
        });
    }
}


module.exports = {
    getRoles
}