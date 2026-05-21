const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendEmail(to, subject, title, body, link) {
    try {

        await transporter.verify();

        const template = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background: #f4f7f5;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="padding: 40px 20px;">

                        <table width="600" cellpadding="0" cellspacing="0" style="
                            background: #ffffff;
                            border-radius: 18px;
                            overflow: hidden;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                        ">

                            <!-- HEADER -->
                            <tr>
                                <td style="
                                    background: linear-gradient(135deg, #1c8f3d, #1c9e43);
                                    padding: 40px;
                                    text-align: center;
                                ">

                                    <h1 style="
                                        margin: 0;
                                        color: white;
                                        font-size: 36px;
                                        letter-spacing: 1px;
                                    ">
                                        Valho!
                                    </h1>

                                    <p style="
                                        color: rgba(255,255,255,0.85);
                                        margin-top: 10px;
                                        font-size: 15px;
                                    ">
                                        Gestão inteligente para seu negócio
                                    </p>

                                </td>
                            </tr>

                            <!-- CONTENT -->
                            <tr>
                                <td style="padding: 50px 40px;">

                                    <h2 style="
                                        margin-top: 0;
                                        color: #111827;
                                        font-size: 28px;
                                    ">
                                        ${title}
                                    </h2>

                                    <p style="
                                        color: #4b5563;
                                        font-size: 16px;
                                        line-height: 1.8;
                                        margin-top: 25px;
                                    ">
                                        ${body}
                                    </p>

                                    <!-- BUTTON -->
                                    <div style="margin-top: 40px; text-align:center;">

                                        <a href="${link}" style="
                                            display: inline-block;
                                            background: #1c8f3d;
                                            color: white;
                                            text-decoration: none;
                                            padding: 16px 32px;
                                            border-radius: 12px;
                                            font-weight: bold;
                                            font-size: 15px;
                                        ">
                                            Acessar Plataforma
                                        </a>

                                    </div>

                                </td>
                            </tr>

                            <!-- FOOTER -->
                            <tr>
                                <td style="
                                    padding: 30px;
                                    background: #f9fafb;
                                    border-top: 1px solid #e5e7eb;
                                    text-align: center;
                                ">

                                    <p style="
                                        margin: 0;
                                        color: #6b7280;
                                        font-size: 13px;
                                        line-height: 1.6;
                                    ">
                                        Este email foi enviado automaticamente pela plataforma Valho!.
                                    </p>

                                    <p style="
                                        margin-top: 10px;
                                        color: #9ca3af;
                                        font-size: 12px;
                                    ">
                                        © ${new Date().getFullYear()} Valho!. Todos os direitos reservados.
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `;


        const info = await transporter.sendMail({
            from: `"Valho!" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html: template
        });

        console.log('🟢 Email enviado:', info.messageId);

        return info;

    } catch (error) {

        console.error('🔴 Mail Error:', error);

        throw new Error(error.message);
    }
}

module.exports = {
    transporter,
    sendEmail
};