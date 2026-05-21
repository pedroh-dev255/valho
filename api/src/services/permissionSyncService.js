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

module.exports = {syncPermissions};