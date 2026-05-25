const pool = require('../configs/db');

const permissions = require('../configs/permissions');

async function syncPermissions() {

    const connection =
        await pool.getConnection();

    try {

        console.log('🔄 Sincronizando permissões...');

        // =========================
        // BUSCA PERMISSÕES DO BANCO
        // =========================

        const [dbPermissions] =
            await connection.query(`
                SELECT id, \`key\`, description
                FROM permissions
            `);

        // MAPA DAS PERMISSÕES DO BANCO
        const dbMap = new Map();

        dbPermissions.forEach(permission => {

            dbMap.set(permission.key, permission);

        });

        // =========================
        // INSERT / UPDATE
        // =========================

        for (const permission of permissions) {

            const exists =
                dbMap.get(permission.key);

            // =========================
            // INSERT
            // =========================

            if (!exists) {

                await connection.query(`
                    INSERT INTO permissions (
                        \`key\`,
                        description
                    )
                    VALUES (?, ?)
                `, [
                    permission.key,
                    permission.description
                ]);

                console.log(
                    `✅ Criada: ${permission.key}`
                );

                continue;
            }

            // =========================
            // UPDATE DESCRIPTION
            // =========================

            if (
                exists.description !==
                permission.description
            ) {

                await connection.query(`
                    UPDATE permissions
                    SET description = ?
                    WHERE id = ?
                `, [
                    permission.description,
                    exists.id
                ]);

                console.log(
                    `♻️ Atualizada: ${permission.key}`
                );

            }
        }

        // =========================
        // REMOVE OBSOLETAS
        // =========================

        const fileKeys =
            permissions.map(p => p.key);

        for (const dbPermission of dbPermissions) {

            if (
                !fileKeys.includes(dbPermission.key)
            ) {

                console.log(
                    `⚠️ Obsoleta: ${dbPermission.key}`
                );


                await connection.query(`
                    DELETE FROM permissions
                    WHERE id = ?
                `, [dbPermission.id]);
                
                console.log(
                    `🗑️ Removida: ${dbPermission.key}`
                );
            }
        }

        console.log(
            '🟢 Permissões sincronizadas'
        );

    } catch (error) {

        console.error(
            '❌ Erro ao sincronizar permissões:',
            error
        );

        throw error;

    } finally {

        connection.release();

    }
}

async function syncAdminRoles() {
    try {
        // Essa função garante que todo cargo de "Administrador" tenha todas as permissões disponíveis.

        console.log('🔄 Sincronizando permissões dos administradores...');
        const [adminRole] = await pool.query('SELECT id FROM roles WHERE name = "Administrador"');

        if (adminRole.length === 0) {
            console.warn('⚠️ Papel "Administrador" não encontrado. Certifique-se de que ele exista antes de sincronizar as permissões.');
            return;
        }
        const adminRoleId = adminRole[0].id;

        const [permissions] = await pool.query('SELECT id FROM permissions');
        const permissionIds = permissions.map(p => p.id);

        const [adminRolePermissions] = await pool.query('SELECT permission_id FROM role_permissions WHERE role_id = ?', [adminRoleId]);
        const adminPermissionIds = adminRolePermissions.map(rp => rp.permission_id);

        // Adicionar permissões ausentes
        for (const permissionId of permissionIds) {
            if (!adminPermissionIds.includes(permissionId)) {
                await pool.query('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [adminRoleId, permissionId]);
                console.log(`✅ Permissão ID ${permissionId} adicionada ao papel "Administrador"`);
            }
        }

        // Remover permissões obsoletas
        for (const adminPermissionId of adminPermissionIds) {
            if (!permissionIds.includes(adminPermissionId)) {
                await pool.query('DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?', [adminRoleId, adminPermissionId]);
                console.log(`🗑️ Permissão ID ${adminPermissionId} removida do papel "Administrador"`);
            }
        }

        console.log('🟢 Permissões dos administradores sincronizadas');
    } catch (error) {
        console.error(
            '❌ Erro ao sincronizar permissões:',
            error
        );

        throw error;

    }
    
}

module.exports = {syncPermissions, syncAdminRoles};