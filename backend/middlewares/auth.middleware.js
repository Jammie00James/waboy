const util = require('util')
const jwt = require('jsonwebtoken')


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
                attributes: ['id', 'isVerified'],
                where: {
                    id: id
                }
            });
            if (user) {
                req.user = user;
                next();
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