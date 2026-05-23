const pool = require('../configs/db');
const { sendEmailService } = require('./mailerService');
const {existEmail} = require('./authService');

const crypto = require('crypto');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const { assert } = require('node:test');
dotenv.config();

async function createInvite(email, institutionId, createdBy) {
    const emailExists = await existEmail(email);
    if (emailExists) {
        throw new Error('Email já cadastrado');
    }

    const [institutionName] = await pool.query('SELECT name FROM institutions WHERE id = ?', [institutionId]);
    if (institutionName.length === 0) {
        throw new Error('Instituição não encontrada');
    }

    const token = crypto.randomBytes(32).toString('hex');
    try {
        // iniciar transação
        await pool.query('START TRANSACTION');
        const [result] = await pool.query('INSERT INTO invites (email, token, created_by, id_institution) VALUES (?, ?, ?, ?)', [email, token, createdBy, institutionId]);
        const emailSent = await sendEmailService(email, `Convite para se juntar à ${institutionName[0].name}`, `Você foi convidado para se juntar à instituição: ${institutionName[0].name}`, `Acesse a plataforma pelo botão abaixo para se registrar`, `${process.env.FRONTEND_URL}/register?invite=${token}`);
        if (!emailSent) {
            // se email não enviado, desfazer transação
            await pool.query('ROLLBACK');
            throw new Error('Erro ao enviar email de convite');
        }

        // confirmar transação
        await pool.query('COMMIT');
        return result;
    } catch (error) {
        // desfazer transação em caso de erro
        await pool.query('ROLLBACK');
        throw new Error('Erro ao criar convite');
    }
}



async function resetPassword(email) {
    try {
        const token = crypto.randomBytes(8).toString('hex');

        const [rows] = await pool.query('UPDATE users SET reset_token = ?, reset_token_expires_at = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?', [token, email]);
        if (rows.affectedRows === 0) {
            return null;
        }
        
        await sendEmailService(email, 'Redefinição de senha', 'Você solicitou uma redefinição de senha.', `Use o botão abaixo para criar uma nova senha. O token de redefinição é válido por 1 hora.<br><br><p style="color: #666;size: 14px;">Caso não tenha solicitado a redefinição de senha, ignore este email.</p>`, `${process.env.FRONTEND_URL}/redefinir-senha/confirmacao?token=${token}`);

        return true;

    } catch (error) {
        throw new Error('Erro ao verificar email: ' + error.message);
    }
}

async function confirmReset(token, newPassword) {
    try {
        const [rows] = await pool.query('SELECT id FROM users WHERE reset_token = ? AND reset_token_expires_at > NOW()', [token]);
        if (rows.length === 0) {
            return null;
        }

        const userId = rows[0].id;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?', [hashedPassword, userId]);

        return true;
    } catch (error) {
        throw new Error('Erro ao confirmar redefinição de senha: ' + error.message);
    }
}

async function getUsersByInstitution(institutionId) {
    try {
        const [activeCount] = await pool.query('SELECT COUNT(*) as total_active FROM users WHERE id_institution = ? AND status = "active"', [institutionId]);
        const [adminCount] = await pool.query('SELECT COUNT(*) as total_admin FROM users u INNER JOIN user_roles ur ON u.id = ur.user_id INNER JOIN roles r ON ur.role_id = r.id WHERE u.id_institution = ? AND r.name = "Administrador" AND u.status = "active"', [institutionId]);
        const [pendingInvites] = await pool.query('SELECT COUNT(email) as total_pending FROM invites WHERE id_institution = ? AND status = "pending"', [institutionId]);
        
        const [rows] = await pool.query('SELECT users.id as id, users.name as name, users.email as email, users.status as status, roles.name as role FROM users INNER JOIN user_roles ON users.id = user_roles.user_id LEFT JOIN roles ON user_roles.role_id = roles.id WHERE users.id_institution = ?', [institutionId]);
        
        return {
            total_active: activeCount[0].total_active,
            total_admin: adminCount[0].total_admin,
            total_pending: pendingInvites[0].total_pending,
            users: rows
        };
    }
    catch (error) {
        throw new Error('Erro ao obter usuários: ' + error.message);
    }
}

module.exports = {
    createInvite,
    resetPassword,
    confirmReset,
    getUsersByInstitution
};