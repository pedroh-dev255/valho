// authService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const permissionService = require('./permissionService');
const pool = require('../configs/db');
const redis = require('../configs/redis');

dotenv.config();

async function existEmail(email) {
    try {
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Erro ao verificar email: ' + error.message);
    }
}

async function existInvite(invite, email) {

    try {

        const [rows] = await pool.query(
            `
            SELECT
                id,
                id_institution,
                status
            FROM invites
            WHERE token = ? AND email = ?
            `,
            [invite, email]
        );

        // NÃO EXISTE
        if (rows.length === 0) {

            return {
                exists: false,
                id: null
            };

        }

        const inviteData = rows[0];

        // EXPIRADO
        if (inviteData.status === 'expired') {

            throw new Error('Convite expirado, entre em contato com o administrador para solicitar um novo convite');

        }

        // ACEITO
        if (inviteData.status === 'accepted') {

            throw new Error('Convite já foi usado');

        }

        return {
            exists: true,
            id: inviteData.id_institution,
            inviteId: inviteData.id
        };

    } catch (error) {

        throw new Error(
            'Erro ao verificar convite: ' +
            error.message
        );

    }
}

async function useInvite(invite) {
    try {
        await pool.query(
            `
            UPDATE invites
            SET status = 'accepted'
            WHERE token = ?
            `,
            [invite]
        );
    } catch (error) {
        throw new Error(
            'Erro ao usar convite: ' +
            error.message
        );
    }
}

async function expireInvite(invite) {
    try {
        await pool.query(
            `
            UPDATE invites
            SET status = 'expired'
            WHERE token = ?
            `,
            [invite]
        );
    } catch (error) {
        throw new Error(
            'Erro ao expirar convite: ' +
            error.message
        );
    }
}

async function isUserActive(email) {
    try {
        const [rows] = await pool.query('SELECT status FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return false;
        }
        return rows[0].status === 'active';
    } catch (error) {
        throw new Error('Erro ao verificar status do usuário: ' + error.message);
    }
}

async function login(email, password) {
    try {
        const [rows] = await pool.query('SELECT id, id_institution, name, email, status, password FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return null;
        }
        const user = rows[0];

        if (user.status !== 'active') {
            throw new Error('Usuário inativo, entre em contato com o administrador para ativar sua conta');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        //retirar senha do objeto user;
        delete user.password;

        // Gerar token JWT
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, institution_id: user.id_institution }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        user.token = token;

        await sessionCreate(user.id);

        await permissionService.refreshUserPermissions(user.id);

        return user;
    } catch (error) {
        throw new Error('Erro ao realizar login: ' + error.message);
    }
}

async function logout(userId) {
    try {
        await sessionDestroy(userId);
        await permissionService.invalidateUserPermissions(userId);
    } catch (error) {
        throw new Error('Erro ao realizar logout: ' + error.message);
    }
}

async function sessionCheck(id) {
    try {
        const session = await redis.get(`session:user:${id}`);
        if (!session) {
            return false;
        }
        const sessionData = JSON.parse(session);
        return sessionData.status === 'active';
    } catch (error) {
        throw new Error('Erro ao verificar sessão: ' + error.message);
    }
}

async function sessionCreate(id) {
    try {
        await redis.setEx(
            `session:user:${id}`,
            process.env.SESSION_TTL || 300,
            JSON.stringify({
                status: 'active'
            })
        );
    }
    catch (error) {
        throw new Error('Erro ao criar sessão: ' + error.message);
    }
}

async function sessionDestroy(id) {
    try {
        await redis.del(`session:user:${id}`);
    }
    catch (error) {
        throw new Error('Erro ao destruir sessão: ' + error.message);
    }
}

async function register(name, inviteId, institution, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [user] = await pool.query('INSERT INTO users (name, id_institution, email, password) VALUES (?, ?, ?, ?)', [name, institution, email, hashedPassword]);
        
        if(!user || user.affectedRows === 0) {
            throw new Error('Erro ao criar usuário');
        }
        
        await pool.query('UPDATE invites SET status = "accepted" WHERE id = ?', [inviteId]);

        await pool.query('INSERT INTO audit_logs (action, user_id, id_institution, details, level) VALUES (?, ?, ?, ?, ?)', ['register', user.insertId, institution, email, 'info']);

        return await login(email, password);
        
    } catch (error) {
        throw new Error('Erro ao registrar usuário: ' + error.message);
    }
}

module.exports = {
    existEmail,
    existInvite,
    useInvite,
    expireInvite,
    login,
    register,
    isUserActive,
    sessionCheck,
    logout
};