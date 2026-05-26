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

        const { roles, permissions, users } = await roleService.getRoles(institutionId);

        return res.status(200).json({
            success: true,
            message: 'Permissões obtidas com sucesso',
            data: {
                roles,
                permissions,
                users
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


async function addRole(req, res) {
    try {
        const institutionId = req.user.institution_id;
        const userId = req.user.id;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'Nome e descrição são obrigatórios'
            });
        }

        const newRole = await roleService.addRole(userId, institutionId, name, description);

        if (!newRole) {
            return res.status(400).json({
                success: false,
                message: 'Não foi possível criar a role'
            });
        }
        return res.status(201).json({
            success: true,
            message: 'Role criada com sucesso'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    getRoles,
    addRole
}