//authMiddleware
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const redis = require('../configs/redis');

dotenv.config();

async function authMiddleware(req, res, next) {

    try {

        // =========================
        // TOKEN
        // =========================

        const authHeader =
            req.headers['authorization'];

        const token =
            authHeader &&
            authHeader.split(' ')[1];

        if (!token) {

            return res.status(401).json({
                success: false,
                message: 'Acesso não autorizado'
            });

        }

        // =========================
        // JWT
        // =========================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // =========================
        // REDIS SESSION
        // =========================

        const session =
            await redis.get(
                `session:user:${decoded.id}`
            );

        // SESSÃO NÃO EXISTE
        if (!session) {

            return res.status(401).json({
                success: false,
                message: 'Sessão inválida'
            });

        }

        const sessionData =
            JSON.parse(session);

        // =========================
        // USER INACTIVE
        // =========================

        if (
            sessionData.status !== 'active'
        ) {

            return res.status(401).json({
                success: false,
                message: 'Usuário inativo'
            });

        }

        // =========================
        // SAVE USER
        // =========================

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });

    }
}

module.exports = authMiddleware;