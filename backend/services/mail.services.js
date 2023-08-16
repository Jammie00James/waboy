const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')
const config = require('../config/config.env')


const MailTemplate = {
    emailVerify: 'Email Verify Requested',
    passwordResetRequested: 'Password Reset Requested',
    passwordUpdated: 'Password Updated',
    welcome: 'welcome',
}

const templates = {
    [MailTemplate.emailVerify]: 'email-verify.html',
    [MailTemplate.welcome]: 'welcome.html',
    [MailTemplate.passwordResetRequested]: 'reset-password-request.html',
    [MailTemplate.passwordUpdated]: 'password-updated.html',
}

class MailService {
    async sendTemplate(template, subject, user, args) {
        let argsData = args ? args : {}

        let templateMarkup = fs.readFileSync(path.join(__dirname, `../templates/${templates[template]}`), 'utf8')
        Object.entries({
            ...user,
            ...(argsData),
        }).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g')
            templateMarkup = templateMarkup.replace(regex, value)
        })

        const mailOptions = {
            from: config.EMAIL_USER,
            to: user.email,
            subject,
            html: templateMarkup,
        }

        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: config.EMAIL_USER,
                    pass: config.EMAIL_PASSWORD,
                },
            })
            await transporter.sendMail(mailOptions)
        } catch (error) {
            console.log(error)
        }
    }
}

const service = new MailService()

module.exports = {MailTemplate, service}