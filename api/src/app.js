const express = require('express');
const cors = require('cors');
const logRequest = require('./middlewares/logginMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const permissionMiddleware = require('./middlewares/permissionMiddleware');

const authRoute = require('./routes/authRoute');
const dashRoute = require('./routes/dashRoute');
const configRoute = require('./routes/configRoute');
const roleRoute = require('./routes/roleRoute');

const { sendEmailService } = require('./services/mailerService');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logRequest);

app.get('/health', (req, res) => {
    return res.json({
        status: 'ok'
    });
});

app.use('/auth', authRoute);

app.post('/auth/validate', authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Token válido'
    });
});

app.use('/api/data/dashboard', authMiddleware, dashRoute);
app.use('/api/config', authMiddleware, configRoute);
app.use('/api/roles', authMiddleware, roleRoute);



module.exports = app;