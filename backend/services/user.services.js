const bcrypt = require('bcryptjs')
const { User, Referral, Token } = require('../config/db')
const config = require('../config/config.env')
const jwt = require('jsonwebtoken')
const { getUpdatedToken } = require('../utils/googleTools')
const CustomError = require('../utils/custom-errors')
const { service, MailTemplate } = require('./mail.services')
const MailService = service
const { Op } = require("sequelize");
const Agent = require('../models/Agent')
const axios = require('axios');

class UserService {
    async me(id) {
        // Check if user exist
        let user = await User.findOne({
            attributes: ['id', 'username', 'email', 'firstname', 'lastname'],
            where: {
                id: id
            }
        });
        if (user) {
            const ref = await Referral.findall({
                attributes: ['id', 'invitee', 'status', 'createdAt'],
                where: {
                    inviter: user.username
                }
            });
            user.push(ref)
            const agents = await Agent.findall({
                attributes: ['id', 'invitee', 'status', 'createdAt'],
                where: {
                    owner: user.id
                }
            });
            user.push(agents)
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

    async googleStatus(owner) {
        const token = await getUpdatedToken(owner)
        if (token) {
            const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response) {
                const userEmail = response.data.email;
                return { userEmail }
            } else {
                return false
            }
        } else {
            return false
        }
    }

}

module.exports = new UserService()

