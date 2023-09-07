const bcrypt = require('bcryptjs')
const { User, Referral, Token } = require('../config/db')
const config = require('../config/config.env')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/custom-errors')
const { service, MailTemplate } = require('./mail.services')
const MailService = service
const { customAlphabet } = require('nanoid')
const { Op } = require("sequelize");


class UserService {
    async me(id) {
        // Check if user exist
        const user = await User.findOne({
            attributes: ['id', 'username','email', 'firstname', 'lastname','phonenumber'],
            where: {
                id: id
            }
        });
        if (user) {
            return user;
        } else {
            throw new CustomError('User not found', 400)
        }
    }

    async update(id, data) {
        if (!data) throw new CustomError('nothing to update', 400)

        // await User.update({
        //     attributes: ['id', 'isVerified'],
        //     where: {
        //         username: referralcode
        //     }
        // });

        return true; 
    }

}

module.exports = new UserService()

