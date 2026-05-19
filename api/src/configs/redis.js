const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

client.on('error', (err) => {
    console.error('Redis Error:', err);
});

client.on('connect', () => {
    console.log('🟢 Redis conectado');
});

client.on('reconnecting', () => {
    console.log('🟡 Redis reconectando...');
});

module.exports = client;