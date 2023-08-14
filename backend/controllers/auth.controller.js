const { User } = require('../database/db')
const authservices = require('../services/auth.services')
const CustomError = require('../utils/custom-errors')


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        let token = await authservices.login(email, password)
        if (token) {
            res.status(200).cookie('__-access', token, { httpOnly: true, secure: true }).json({ "Message": "Login Success" })
        }
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(err.status).json({ error: err.message });
          } else {
            console.error(err);
            res.status(500).json({ error: 'An error occured' });
          }
    }

}


exports.logout = (req, res) => {
    res.clearCookie('Jwt');
    res.status(200).json({ success: true, message: 'Logout successful' });
};
