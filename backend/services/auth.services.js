const bcrypt = require('bcryptjs')
const { User } = require('../config/db')
const config = require('../config/config.env')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/custom-errors')


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
}

module.exports = AuthService

