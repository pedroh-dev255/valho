const permissionService = require('../services/permissionService');

function permissionMiddleware(permission) {

    return async (req, res, next) => {

        try {

            const permissions =
                await permissionService.getUserPermissions(req.user.id);

            const hasPermission =
                permissions.includes(permission);

            if (!hasPermission) {

                return res.status(403).json({
                    success: false,
                    message: 'Sem permissão'
                });

            }

            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: 'Erro ao validar permissões'
            });

        }
    };
}

module.exports = permissionMiddleware;