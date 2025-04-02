import nodemailer from 'nodemailer'
import mjml from 'mjml'
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL_USER,
        pass: process.env.AUTH_EMAIL_PASSWORD
    },
}, {
    from: `Татьяна Викторовна <${process.env.AUTH_EMAIL_SENDER}>`,
});

const mailer = (message, res) => {
    try {
        transporter.sendMail(message, (err, info) => {
            if (err) {
                throw new Error(err)
            }
            next()
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
    try {
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

const setFilePath = (file) => {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const mjmlFilePath = path.join(currentDir, 'mjml', file);
    console.log(mjmlFilePath)
    return mjmlFilePath
}
const defineMessage = (recipient, subject, htmlTemplate) => {
    return {
        to: recipient,
        subject: subject,
        html: htmlTemplate
    }
}

export const sendCreateAccountMail = (req, res, body) => {
    try {
        fs.readFile(setFilePath('createClientAccount.mjml'), 'utf-8', (err, mjmlTemplate) => {
            if (err) {
                throw new Error('Failed to read template');
            }
            const template = mjmlTemplate                
                .replace('{{email}}', body.email)
                .replace('{{link}}', body.resetLink)
                .replace('{{isPasswordReset}}', 'изменен.')                

            const htmlOutput = mjml(template).html

            mailer(defineMessage(body.email, 'Ваша учетная запись у врача ', htmlOutput), res)
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

export const sendRescheduleAppointmentMail = (req, res, body) => {
    try {
        fs.readFile(setFilePath('rescheduleAppointment.mjml'), 'utf-8', (err, mjmlTemplate) => {
            if (err) {
                throw new Error('Failed to read template');
            }
            const template = mjmlTemplate
                .replace('{{old_date}}', body.old_date)
                .replace('{{old_time}}', body.old_time)
                .replace('{{date}}', body.formatedDate)
                .replace('{{time}}', body.time)

            const htmlOutput = mjml(template).html

            mailer(defineMessage(body.email, 'Ваш визит перенесен', htmlOutput), res)
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

export const sendAddAppointmentMail = (req, res, body) => {
    try {
        fs.readFile(setFilePath('addAppointment.mjml'), 'utf-8', (err, mjmlTemplate) => {
            if (err) {
                throw new Error('Failed to read template');
            }
            const template = mjmlTemplate                
                .replace('{{date}}', body.formatedDate)
                .replace('{{time}}', body.time)

            const htmlOutput = mjml(template).html

            mailer(defineMessage(body.recipientEmail, 'Информация о вашем визите', htmlOutput), res)
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}

export const sendResetPasswordLink = (req, res, link, email) => {
    try {
        fs.readFile(setFilePath('resetPassword.mjml'), 'utf-8', (err, mjmlTemplate) => {
            if (err) {
                return res.status(500).send('Failed to read template');
            }
            const finalTemplate = mjmlTemplate                
                .replace('{{link}}', link)
                .replace('{{email}}', email)

            const htmlOutput = mjml(finalTemplate).html

            mailer(defineMessage(email, 'Ссылка для сброса пароля', htmlOutput), res)            
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message, data: null })
    }
}