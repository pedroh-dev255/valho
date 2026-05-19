const express = require('express');
const cors = require('cors');
const logRequest = require('./middlewares/logginMiddleware');

const authRoute = require('./routes/authRoute');

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

module.exports = app;