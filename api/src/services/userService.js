const pool = require('../configs/db');
const { sendEmailService } = require('./mailerService');
const {existEmail} = require('./authService');
const crypto = require('crypto');
const dotenv = require('dotenv');
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


module.exports = {
    createInvite
};