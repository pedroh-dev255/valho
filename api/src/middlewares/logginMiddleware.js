const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../logs');

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// =========================
// COLORS TERMINAL
// =========================

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

// =========================
// HELPERS
// =========================

const getDate = () => {
    return new Date().toISOString().split('T')[0];
};

const getTime = () => {
    return new Date().toISOString();
};

const getLogFile = (type) => {
    return path.join(LOG_DIR, `${type}-${getDate()}.log`);
};

const writeLog = (type, message) => {
    fs.appendFile(getLogFile(type), message + '\n', (err) => {
        if (err) {
            console.error('Erro ao salvar log:', err);
        }
    });
};

// =========================
// LIMPA LOGS ANTIGOS
// =========================

const cleanOldLogs = (days = 7) => {
    fs.readdir(LOG_DIR, (err, files) => {
        if (err) return;

        const now = Date.now();

        files.forEach(file => {
            const filePath = path.join(LOG_DIR, file);

            fs.stat(filePath, (err, stats) => {
                if (err) return;

                const diffDays =
                    (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

                if (diffDays > days) {
                    fs.unlink(filePath, () => {});
                }
            });
        });
    });
};

cleanOldLogs();

// =========================
// LOGGER MIDDLEWARE
// =========================

const logger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        const ip =
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress;

        const user =
            req.user?.id ||
            req.user?.email ||
            'guest';

        const status = res.statusCode;

        // ignora arquivos estáticos
        if (
            req.url.includes('.png') ||
            req.url.includes('.jpg') ||
            req.url.includes('.css') ||
            req.url.includes('.js') ||
            req.url.includes('favicon')
        ) {
            return;
        }

        // body limpo
        const sanitizedBody = { ...req.body };

        delete sanitizedBody.password;
        delete sanitizedBody.token;
        delete sanitizedBody.accessToken;
        delete sanitizedBody.refreshToken;

        const log =
            `[${getTime()}] ` +
            `${req.method} ${req.originalUrl} ` +
            `${status} ` +
            `${duration}ms ` +
            `IP:${ip} ` +
            `USER:${user} ` +
            `BODY:${JSON.stringify(sanitizedBody)}`;

        // =========================
        // TERMINAL COLORS
        // =========================

        if (status >= 500) {
            console.log(colors.red + log + colors.reset);
        }/* else if (status >= 400) {
            console.log(colors.yellow + log + colors.reset);
        } else {
            console.log(colors.green + log + colors.reset);
        }*/

        // =========================
        // SAVE LOG FILE
        // =========================

        if (status >= 400) {
            writeLog('error', log);
        } else {
            writeLog('info', log);
        }
    });

    next();
};

module.exports = logger;