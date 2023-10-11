const util = require('util')
const jwt = require('jsonwebtoken')
const { User, Token } = require('../config/db')
const config = require('../config/config.env')
const { Op } = require("sequelize");
const { OAuth2Client } = require('google-auth-library');


const authenticateUser = async (req, res, next) => {
    try {
        let tokenHeader
        const authHeader = req.headers.authorization;
        if (authHeader) {
            // Split the header to extract the type and token/credentials
            const [authType, authValue] = authHeader.split(' ');

            if (authType === 'Bearer' && authValue) {
                // Handle JWT authentication
                tokenHeader = authValue;
            }
        }

        const tokenCookie = req.cookies.__access;
        if (tokenCookie) {
            // Verify the token
            console.log('jah')
            const verifyToken = util.promisify(jwt.verify);
            const decoded = await verifyToken(tokenCookie, config.JWT_SECRET_KEY);
            let id = decoded.id;
            if (id) {
                const user = await User.findOne({
                    attributes: ['id', 'email', 'isverified'],
                    where: {
                        id: id
                    }
                });
                if (user) {
                    if (req.originalUrl == '/api/auth/email-verify/request' || req.originalUrl == '/api/auth/email-verify') {
                        if (user.isverified === 'T') {
                            return res.status(401).json({ error: 'User Email Already Verified' });
                        }
                        req.user = user;
                        next();
                    } else {
                        if (user.isverified === "F") {
                            return res.status(401).json({ error: 'User Email Not Verified' });
                        }
                        req.user = user;
                        next();
                    }

                } else {
                    return res.status(401).json({ error: 'Invalid Token' });
                }
            } else {
                return res.status(401).json({ error: 'Invalid Token' });
            }
        } else if (tokenHeader) {
            // Verify the token

            console.log(tokenHeader)

            const verifyToken = util.promisify(jwt.verify);
            const decoded = await verifyToken(tokenHeader, config.JWT_SECRET_KEY);
            let id = decoded.id;
            if (id) {
                const user = await User.findOne({
                    attributes: ['id', 'email', 'isverified'],
                    where: {
                        id: id
                    }
                });
                if (user) {
                    if (req.originalUrl == '/api/auth/email-verify/request' || req.originalUrl == '/api/auth/email-verify') {
                        if (user.isverified === 'T') {
                            return res.status(401).json({ error: 'User Email Already Verified' });
                        }
                        req.user = user;
                        next();
                    } else {
                        if (user.isverified === "F") {
                            return res.status(401).json({ error: 'User Email Not Verified' });
                        }
                        req.user = user;
                        next();
                    }

                } else {
                    return res.status(401).json({ error: 'Invalid Token' });
                }
            } else {
                return res.status(401).json({ error: 'Invalid Token' });
            }
        } else {
            return res.status(401).json({ error: 'No token provided' });
        }
    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
}

const validateGoogle = async (req, res, next) => {
    const user = req.user

    const token = await Token.findOne({
        attributes: ['otp'],
        where: {
            [Op.and]: [
                { user: user.id },
                { type: "GOOGLE_REFRESH_TOKEN" }
            ]
        }
    });
    if (!token) next()

    if (token) {
        try {
            let refresh_token = token.otp
            const oAuth2Client = new OAuth2Client(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_REDIRECT_URI);
            const { tokens } = await oAuth2Client.getToken(refresh_token);
            console.log(tokens)
        } catch (error) {

        }
    }
}

const checkConnection = async (req, res, next) => {
    const user = req.user

    const token = await Token.findOne({
        attributes: ['otp'],
        where: {
            [Op.and]: [
                { user: user.id },
                { type: "GOOGLE_REFRESH_TOKEN" }
            ]
        }
    });

    if (token) {
        next()
    } else {
        return res.status(401).json({ error: 'Google account not connected' });
    }
}



module.exports = { authenticateUser, validateGoogle, checkConnection }