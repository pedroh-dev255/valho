const {sendEmail} = require('../configs/mailer');
const dotenv = require('dotenv');

dotenv.config();

async function sendEmailService(to, subject, title, body, link) {
    try {
        const result  = await sendEmail(to, subject, title, body, link);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Erro ao enviar email: ' + error.message);
    }
}


module.exports = {
    sendEmailService
};