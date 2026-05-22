const pool = require('../configs/db');
const { sendEmailService } = require('./mailerService');
const {existEmail} = require('./authService');

const crypto = require('crypto');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
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

module.exports = {
    createInvite,
    resetPassword,
    confirmReset
};