const bcrypt = require('bcryptjs')
const { User, Referral, Token } = require('../config/db')
const config = require('../config/config.env')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/custom-errors')
const { service, MailTemplate } = require('./mail.services')
const MailService = service
const { generateToken } = require('../utils/tools')
const { Op } = require("sequelize");
const { OAuth2Client } = require('google-auth-library');


class AuthService {
    async login(email, password) {
        if (!email) throw new CustomError('email is required', 400)
        if (!password) throw new CustomError('password is required', 400)

        // Check if user exist
        const user = await User.findOne({
            attributes: ['id', 'password'],
            where: {
                email: email
            }
        });
        if (user) {
            let verify = await bcrypt.compare(password, user.password);
            if (verify) {
                let token = jwt.sign({ id: user.id }, config.JWT_SECRET_KEY, { expiresIn: '24h' });
                return token
            } else {
                throw new CustomError('Invalid Username or Password', 400)
            }
        } else {
            throw new CustomError('Invalid Username or Password', 400)
        }
    }

    async signup(username, email, firstname, lastname, password, referralcode) {
        if (!username) throw new CustomError('Username is required', 400)
        if (!email) throw new CustomError('Email is required', 400)
        if (!firstname) throw new CustomError('Firstname is required', 400)
        if (!lastname) throw new CustomError('Lastname is required', 400)
        if (!password) throw new CustomError('Password is required', 400)
        // Check if user exist
        const user = await User.findOne({
            attributes: ['username', 'email'],
            where: {
                [Op.or]: [
                    { username: username },
                    { email: email }
                ]
            }
        });
        if (user) {
            if (user.email === email) throw new CustomError('User already exists', 400)
            if (user.username === username) throw new CustomError('Username taken', 400)
        }
        let newuser = await User.create({ username, email, firstname, lastname, password })

        if (referralcode) {
            const ref = await User.findOne({
                attributes: ['id', 'isverified'],
                where: {
                    username: referralcode
                }
            });
            if (ref && (ref.isVerified === "T")) {
                const referral = Referral.create({ inviter: referralcode, invitee: username })
            }
        }

        MailService.sendTemplate(MailTemplate.welcome, 'Welcome to Wabot', { name: newuser.username, email: newuser.email }, {})

        this.requestEmailVerification(newuser.email)

        let token = jwt.sign({ id: newuser.id }, config.JWT_SECRET_KEY, { expiresIn: '24h' });
        return token
    }

    async requestEmailVerification(email) {
        if (!email) throw new CustomError('Email is required', 400)
        // Check if user exist
        const user = await User.findOne({
            attributes: ['id', 'username', 'email', 'isverified'],
            where: {
                email: email
            }
        });
        if (!user) throw new CustomError('email does not exist', 400)

        let token = await Token.findOne({
            attributes: ['id'],
            where: {
                user: user.id
            }
        });
        if (token) {
            await Token.destroy({
                where: {
                    id: token.id
                }
            });
        }

        const otp = generateToken()
        console.log(otp)

        token = await Token.create({ otp, type: "EMAIL_VERIFICATION", user: user.id })
        await MailService.sendTemplate(MailTemplate.emailVerify, 'Verify Your Email', { name: user.username, email: user.email }, { otp })

        return true
    }


    async verifyEmail(id, otp) {
        if (!otp) throw new CustomError('Otp is Required', 400)

        let token = await Token.findOne({
            attributes: ['id', 'otp'],
            where: {
                [Op.and]: [
                    { user: id },
                    { type: "EMAIL_VERIFICATION" }
                ]
            }
        });
        if (!token) throw new CustomError('invalid or expired email verify otp', 400)
        const isValid = await bcrypt.compare(otp, token.otp)
        if (!isValid) throw new CustomError('invalid or expired email verify otp', 400)

        await User.update({ isverified: 'T' }, {
            where: {
                id: id
            }
        });

        Token.destroy({
            where: {
                id: token.id
            }
        });

        return true
    }

    async googleAccess(code, owner) {
        if (!code) throw new CustomError('Code is Required', 400)







        const result = 3;
        let token = await Token.findOne({
            attributes: ['id'],
            where: {
                [Op.and]: [
                    { user: owner },
                    { type: "GOOGLE_ACCESS" }
                ]
            }
        });

        if (token) {
            await Token.update({ otp: result.refresh_token }, {
                where: {
                    id: id
                }
            });
        } else {
            newtoken = await Token.create({ otp: result.refresh_token, type: "GOOGLE_ACCESS", user: owner })
        }
        return true
    }


    async generateAuthCode() {
        const oAuth2Client = new OAuth2Client(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_REDIRECT_URI);

        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline', // Use 'offline' to get a refresh token
            scope: ['https://www.googleapis.com/auth/contacts'], // Replace with the desired scope
        });
        return authorizeUrl
    }

    async generateAuthCodeCallback(code, owner) {
        if (!code) throw new CustomError('Something went wrong', 400)
        const oAuth2Client = new OAuth2Client(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_REDIRECT_URI);
        const { tokens } = await oAuth2Client.getToken(code);

        console.log('Access Token:', tokens.access_token);
        console.log('Refresh Token:', tokens.refresh_token);

        if (tokens.refresh_token) {
            const token = await Token.create({ otp: tokens.refresh_token, type: "GOOGLE_ACCESS", user: owner })
            if (token) return true
        }else{
            return false
        }
    }


    async removeOAuth2Client(id, owner) {
        if (!id) throw new CustomError('Google account id not specified', 400)

        const token = await Token.findOne({
            attributes: ['id'],
            where: {
                [Op.and]: [
                    { user: owner },
                    { type: "GOOGLE_ACCESS" },
                    { id: id }
                ]
            }
        });
        if (!token) throw new CustomError('Google account not found', 400)

        //Check if google account is being used if it is return it else continue 

        Token.destroy({
            where: {
                id: token.id
            }
        });

        return true
    }
}

module.exports = new AuthService()

