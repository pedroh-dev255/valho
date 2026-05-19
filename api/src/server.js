require('dotenv').config();

const app = require('./app');
const pool = require('./configs/db');
const redisClient = require('./configs/redis');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {

        // MYSQL
        const connection = await pool.getConnection();
        console.log('🟢 MySQL conectado');
        connection.release();

        // REDIS
        await redisClient.connect();

        // START SERVER
        app.listen(PORT, () => {
            console.log(`🟢 Servidor rodando na porta ${PORT}`);
        });

    } catch (err) {
        console.error('❌ Erro ao iniciar servidor:', err);
        process.exit(1);
    }
}

startServer();