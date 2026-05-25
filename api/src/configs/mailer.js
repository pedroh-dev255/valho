const nodemailer = require('nodemailer');
const path = require('path');

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

async function sendEmail(
    to,
    subject,
    title,
    body,
    link = null
) {
    try {

        await transporter.verify();

        const hasLink =
            typeof link === 'string' &&
            link.trim() !== '';

        const template = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8" />

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />

            <title>${subject}</title>
        </head>

        <body style="
            margin:0;
            padding:0;
            background:#09090B;
            font-family:
                Arial,
                Helvetica,
                sans-serif;
        ">

            <!-- PREVIEW -->
            <div style="
                display:none;
                opacity:0;
                overflow:hidden;
                max-height:0;
            ">
                ${title}
            </div>

            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    padding:40px 16px;
                    background:#09090B;
                "
            >
                <tr>
                    <td align="center">

                        <!-- CONTAINER -->
                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                max-width:640px;
                                background:#111113;
                                border-radius:32px;
                                overflow:hidden;
                                border:1px solid #27272A;
                                box-shadow:
                                    0 20px 60px rgba(0,0,0,0.45);
                            "
                        >

                            <!-- HEADER -->
                            <tr>
                                <td
                                    align="center"
                                    style="
                                        padding:
                                            48px
                                            40px
                                            36px;
                                        position:relative;
                                        background:
                                            linear-gradient(
                                                180deg,
                                                #111113 0%,
                                                #0F0F11 100%
                                            );
                                    "
                                >
                                    <!-- LOGO -->
                                    <div style="
                                        position:relative;
                                        z-index:2;
                                    ">
                                        <h1 style="
                                            margin:0;
                                            color:#FFFFFF;
                                            font-size:34px;
                                            font-weight:800;
                                            letter-spacing:-1px;
                                        ">
                                            Valho!
                                        </h1>

                                        <p style="
                                            margin:
                                                14px
                                                auto
                                                0;
                                            max-width:420px;
                                            color:#A1A1AA;
                                            font-size:15px;
                                            line-height:1.8;
                                        ">
                                            Gestão inteligente para empresas modernas.
                                        </p>
                                    </div>

                                </td>
                            </tr>

                            <!-- CONTENT -->
                            <tr>
                                <td style="
                                    padding:
                                        48px
                                        40px;
                                ">

                                    <h2 style="
                                        margin:
                                            0
                                            0
                                            24px;
                                        color:#FFFFFF;
                                        font-size:30px;
                                        font-weight:700;
                                        letter-spacing:-0.5px;
                                    ">
                                        ${title}
                                    </h2>

                                    <div style="
                                        color:#D4D4D8;
                                        font-size:16px;
                                        line-height:1.9;
                                    ">
                                        ${body}
                                    </div>

                                    ${
                                        hasLink
                                            ? `
                                            <!-- BUTTON -->
                                            <div style="
                                                margin-top:42px;
                                                text-align:center;
                                            ">

                                                <a
                                                    href="${link}"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style="
                                                        display:inline-block;
                                                        padding:
                                                            16px
                                                            30px;
                                                        border-radius:18px;
                                                        background:
                                                            linear-gradient(
                                                                135deg,
                                                                #22C55E,
                                                                #16A34A
                                                            );
                                                        color:#000000;
                                                        text-decoration:none;
                                                        font-size:15px;
                                                        font-weight:800;
                                                        box-shadow:
                                                            0 10px 30px
                                                            rgba(
                                                                34,
                                                                197,
                                                                94,
                                                                0.28
                                                            );
                                                    "
                                                >
                                                    Acessar Plataforma
                                                </a>

                                            </div>

                                            <!-- FALLBACK -->
                                            <div style="
                                                margin-top:28px;
                                                padding:18px;
                                                border-radius:18px;
                                                background:#09090B;
                                                border:
                                                    1px solid
                                                    #27272A;
                                            ">

                                                <p style="
                                                    margin:
                                                        0
                                                        0
                                                        10px;
                                                    color:#FFFFFF;
                                                    font-size:13px;
                                                    font-weight:700;
                                                ">
                                                    Caso o botão não funcione:
                                                </p>

                                                <a
                                                    href="${link}"
                                                    style="
                                                        color:#22C55E;
                                                        font-size:13px;
                                                        line-height:1.8;
                                                        word-break:break-all;
                                                        text-decoration:none;
                                                    "
                                                >
                                                    ${link}
                                                </a>

                                            </div>
                                            `
                                            : ''
                                    }

                                </td>
                            </tr>

                            <!-- FOOTER -->
                            <tr>
                                <td style="
                                    padding:
                                        32px
                                        28px;
                                    border-top:
                                        1px solid
                                        #27272A;
                                    background:#0D0D0F;
                                    text-align:center;
                                ">

                                    <p style="
                                        margin:0;
                                        color:#71717A;
                                        font-size:13px;
                                        line-height:1.8;
                                    ">
                                        Este email foi enviado automaticamente pela plataforma Valho!.
                                    </p>

                                    <p style="
                                        margin-top:12px;
                                        color:#52525B;
                                        font-size:12px;
                                    ">
                                        © ${new Date().getFullYear()} Valho!.
                                        Todos os direitos reservados.
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
            html: template,
        });

        console.log(
            '🟢 Email enviado:',
            info.messageId
        );

        return info;

    } catch (error) {

        console.error(
            '🔴 Mail Error:',
            error
        );

        throw new Error(error.message);
    }
}

module.exports = {
    transporter,
    sendEmail
};