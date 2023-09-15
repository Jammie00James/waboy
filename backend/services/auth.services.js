const bcrypt = require('bcryptjs')
const { User, Referral, Token } = require('../config/db')
const config = require('../config/config.env')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/custom-errors')
const { service, MailTemplate } = require('./mail.services')
const MailService = service
const { customAlphabet } = require('nanoid')
const { Op } = require("sequelize");


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

        const nanoidOTP = customAlphabet('012345789', 6)
        const otp = nanoidOTP()
        console.log(otp)

        token = await Token.create({ otp, type: "EMAIL_VERIFICATION", user: user.id })
        await MailService.sendTemplate(MailTemplate.emailVerify, 'Verify Your Email', { name: user.username, email: user.email }, { otp })

        return true
    }


    async verifyEmail(id, otp) {
        if (!otp) throw new CustomError('Otp is Required', 400)

        let token = await Token.findOne({
            attributes: ['id','otp'],
            where: {
                [Op.and]: [
                    { user: id },
                    { type: "EMAIL_VERIFICATION"}
                ]
            }
        });
        if (!token) throw new CustomError('invalid or expired email verify otp', 400)
        const isValid = await bcrypt.compare(otp, token.otp)
        if (!isValid) throw new CustomError('invalid or expired email verify otp', 400)

        await User.update({isverified:'T'},{
            where: {
                id:id
            }
        });

        Token.destroy({
            where: {
                id: token.id
            }
        });

        return true
    }


}

module.exports = new AuthService()

