const pool = require('../configs/db');


async function getRolesPermission(institutionId) {
    try {
        /*
        | Busca:
        | - Roles da instituição
        | - Usuários vinculados
        | - Permissões vinculadas
        */

        const [rows] = await pool.query(`
            SELECT
                r.id AS role_id,
                r.name AS role_name,
                r.description AS role_description,

                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                u.status AS user_status,

                p.id AS permission_id,
                p.key AS permission_key

            FROM roles r

            LEFT JOIN user_roles ur
                ON ur.role_id = r.id

            LEFT JOIN users u
                ON u.id = ur.user_id

            LEFT JOIN role_permissions rp
                ON rp.role_id = r.id

            LEFT JOIN permissions p
                ON p.id = rp.permission_id

            WHERE r.id_institution = ?

            ORDER BY r.name ASC
        `, [institutionId]);

        const rolesMap = new Map();

        for (const row of rows) {
            if (!rolesMap.has(row.role_id)) {

                const isSystem =
                    row.role_name?.toLowerCase() === "administrador";

                rolesMap.set(row.role_id, {
                    id: row.role_id,
                    name: row.role_name,
                    description: row.role_description,
                    system: isSystem,

                    users: [],
                    permissions: [],

                    _userIds: new Set(),
                    _permissionKeys: new Set()
                });

            }

            const role = rolesMap.get(row.role_id);

            if (
                row.user_id &&
                !role._userIds.has(row.user_id)
            ) {

                role.users.push({
                    id: row.user_id,
                    name: row.user_name,
                    email: row.user_email,
                    active: row.user_status === "active"
                });

                role._userIds.add(row.user_id);

            }


            if (
                row.permission_key &&
                !role._permissionKeys.has(row.permission_key)
            ) {

                role.permissions.push(row.permission_key);

                role._permissionKeys.add(row.permission_key);

            }

        }

        const [permissionsRows] = await pool.query(`
            SELECT
                *
            FROM permissions
        `);

        const [users] = await pool.query(" SELECT id_institution, id, name, email, status FROM users WHERE status = 'active' AND id_institution = ?", [institutionId]);

        const roles = Array.from(rolesMap.values()).map((role) => {

            delete role._userIds;
            delete role._permissionKeys;

            return role;

        });

        return { roles, permissions: permissionsRows, users };
    } catch (error) {
        throw new Error('Erro ao obter roles e permissões: ' + error.message);
    }
}

async function addRole(userId, institutionId, name, description) {
    try {
        const [result] = await pool.query(`
            INSERT INTO roles (id_institution, name, description)
            VALUES (?, ?, ?)
        `, [institutionId, name, description]);
        await pool.query('INSERT INTO audit_logs (action, user_id, id_institution, details) VALUES (?, ?, ?, ?)', ['add_role', userId, institutionId, `${name}`]);
        return result;
    } catch (error) {
        throw new Error('Erro ao criar role: ' + error.message);
    }
}


module.exports = {
    getRoles: getRolesPermission,
    addRole
};