const pool = require('../configs/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function existEmail(email) {
    try {
        const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Erro ao verificar email: ' + error.message);
    }
}



async function login(email, password) {
    try {
        const [rows] = await pool.query('SELECT id, name, email, password FROM users WHERE email = ?', [email]);

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
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        user.token = token;

        //console.log('Usuário logado com sucesso:', user);

        return user;
    } catch (error) {
        throw new Error('Erro ao realizar login: ' + error.message);
    }
}

async function register(name, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        return await login(email, password);
        
    } catch (error) {
        throw new Error('Erro ao registrar usuário: ' + error.message);
    }
}

module.exports = {
    existEmail,
    login,
    register
};