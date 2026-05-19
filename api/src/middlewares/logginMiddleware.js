const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../logs');

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

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
    fs.appendFile(getLogFile(type), message + '\n', () => {});
};

// =========================
// CLEAN OLD LOGS
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
                    (now - stats.mtimeMs) /
                    (1000 * 60 * 60 * 24);

                if (diffDays > days) {
                    fs.unlink(filePath, () => {});
                }
            });
        });
    });
};

cleanOldLogs();

// =========================
// LOGGER
// =========================

const logger = (req, res, next) => {

    const start = Date.now();

    // =========================
    // INTERCEPT RESPONSE
    // =========================

    const originalJson = res.json;

    let responseBody = null;

    res.json = function (body) {
        responseBody = body;
        return originalJson.call(this, body);
    };

    res.on('finish', () => {

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

        const duration = Date.now() - start;

        const ip =
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress;

        const user =
            req.user?.id ||
            req.user?.email ||
            'guest';

        const status = res.statusCode;

        // =========================
        // SANITIZE REQUEST
        // =========================

        const sanitizedRequest = { ...req.body };

        delete sanitizedRequest.password;
        delete sanitizedRequest.token;
        delete sanitizedRequest.accessToken;
        delete sanitizedRequest.refreshToken;

        // =========================
        // SANITIZE RESPONSE
        // =========================

        const sanitizedResponse = responseBody
            ? JSON.parse(JSON.stringify(responseBody))
            : null;

        if (sanitizedResponse?.user?.token) {
            sanitizedResponse.user.token = '[TOKEN]';
        }

        // =========================
        // LOG
        // =========================

        const log =
            `[${getTime()}] ` +
            `${req.method} ${req.originalUrl} ` +
            `${status} ` +
            `${duration}ms ` +
            `IP:${ip} ` +
            `USER:${user} ` +
            `REQ:${JSON.stringify(sanitizedRequest)} ` +
            `RES:${JSON.stringify(sanitizedResponse.message)}`;

        // =========================
        // TERMINAL
        // =========================

        if (status >= 500) {
            console.log(colors.red + log + colors.reset);
        } /*else if (status >= 400) {
            console.log(colors.yellow + log + colors.reset);
        } else {
            console.log(colors.green + log + colors.reset);
        }*/

        // =========================
        // SAVE FILE
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