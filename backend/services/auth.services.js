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
            if(user.email === email) throw new CustomError('User with Email already exists', 400)
            if(user.username === email) throw new CustomError('Username taken', 400)
        }
        let newuser = await User.create({ username, email, firstname, lastname, password})



        if (referralcode) {
            const ref = await User.findOne({
                attributes: ['id'],
                where: {
                    username: referralcode
                }
            });
        }



    }

}

module.exports = AuthService

