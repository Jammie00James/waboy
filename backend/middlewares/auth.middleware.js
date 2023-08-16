const util = require('util')
const jwt = require('jsonwebtoken')
const {User} = require('../config/db')

export async function authenticateUser(req, res, next) {
    const token = req.cookies.__-access;
    if (token) {
        // Verify the token
        console.log('jah')
        const verifyToken = util.promisify(jwt.verify);
        const decoded = await verifyToken(token, config.JWT_SECRET_KEY);
        let id = decoded.id;
        if (id) {
            const user = await User.findOne({
                attributes: ['id','email', 'isVerified'],
                where: {
                    id: id
                }
            });
            if (user) {
                if(req.originalUrl == '/api/auth/email-verify/request' && req.originalUrl == '/api/auth/email-verify'){
                    if(user.isVerified === "T") return res.status(401).json({ error: 'User Email Already Verified' });
                    req.user = user;
                    next();
                }else{
                    if(user.isVerified === "F") return res.status(401).json({ error: 'User Email Not Verified' });
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
}