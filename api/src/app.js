const express = require('express');
const cors = require('cors');
const logRequest = require('./middlewares/logginMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const permissionMiddleware = require('./middlewares/permissionMiddleware');

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');

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

app.use('/api/users', authMiddleware, userRoute);


app.post("/api/security", authMiddleware, permissionMiddleware("users."), async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: 'Ação massa'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erro ao verificar permissão',
            error: error.message
        });
    }
});


module.exports = app;