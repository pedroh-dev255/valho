// authService.js
const pool = require('../configs/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const permissionService = require('./permissionService');

async function existEmail(email) {
    try {
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Erro ao verificar email: ' + error.message);
    }
}

async function existInvite(invite) {

    try {

        const [rows] = await pool.query(
            `
            SELECT
                id,
                id_institution,
                status
            FROM invites
            WHERE token = ?
            `,
            [invite]
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
            id: inviteData.id_institution
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


async function login(email, password) {
    try {
        const [rows] = await pool.query('SELECT id, id_institution, name, email, password FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return null;
        }
        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }

        //retirar senha do objeto user;
        delete user.password;

        // Gerar token JWT
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, institution_id: user.id_institution }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        user.token = token;

        await permissionService.refreshUserPermissions(user.id);

        return user;
    } catch (error) {
        throw new Error('Erro ao realizar login: ' + error.message);
    }
}

async function register(name, institution, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (name, id_institution, email, password) VALUES (?, ?, ?, ?)', [name, institution, email, hashedPassword]);

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
    register
};