const pool = require('../configs/db');
const redis = require('../configs/redis');
const dotenv = require('dotenv');
dotenv.config();

const CACHE_TTL = process.env.PERM_CACHE_TTL || 300; // 5 minutos

async function buildUserPermissions(userId) {

    const [rows] = await pool.query(`
        SELECT DISTINCT p.key
        FROM user_roles ur
        INNER JOIN role_permissions rp
            ON rp.role_id = ur.role_id
        INNER JOIN permissions p
            ON p.id = rp.permission_id
        WHERE ur.user_id = ?
    `, [userId]);
    
    //console.log(`Permissões do usuário ${userId} atualizadas:`, rows.map(r => r.key));
    return rows.map(row => row.key);
}

async function refreshUserPermissions(userId) {
    //console.log(`Atualizando permissões do usuário ${userId}...`);
    const permissions = await buildUserPermissions(userId);

    await redis.setEx(
        `perm:user:${userId}`,
        CACHE_TTL,
        JSON.stringify(permissions)
    );

    return permissions;
}

async function getUserPermissions(userId) {

    const cacheKey = `perm:user:${userId}`;

    const cached = await redis.get(cacheKey);

    if (cached) {
        //console.log(`Permissões do usuário ${userId} encontradas no cache.`);
        return JSON.parse(cached);
    }
    //console.log(`Permissões do usuário ${userId} não encontradas no cache. Recalculando...`);
    return await refreshUserPermissions(userId);
}

async function invalidateUserPermissions(userId) {

    await redis.del(`perm:user:${userId}`);
    //console.log(`Permissões do usuário ${userId} invalidadas no cache.`);
}

module.exports = {
    getUserPermissions,
    refreshUserPermissions,
    invalidateUserPermissions
};