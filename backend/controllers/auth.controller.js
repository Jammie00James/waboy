const AuthService = require('../services/auth.services')
const CustomError = require('../utils/custom-errors')


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        let token = await AuthService.login(email, password)
        if (token) {
            res.status(200).cookie('__access', token, { httpOnly: true, secure: true }).json({ "Message": "Login Successful" })
        }
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}

exports.signup = async (req, res) => {
    try {
        const { username, email, firstname, lastname, password, referralcode} = req.body
        let token = await AuthService.signup(username, email, firstname, lastname, password, referralcode)
        if (token) {
            res.status(200).cookie('__access', token, { httpOnly: true, secure: true }).json({ "Message": "Signup Successful" })
        }
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}


exports.emailVerifyRequest = async (req, res) => {
    try {
        let state = await AuthService.requestEmailVerification(req.user.email)
        if (state) {
            res.status(200).json({ success: true, message: 'Verification Mail Sent Successfully' });
        }
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}

exports.emailVerify = async (req, res) => {
    try {
        const {otp} = req.body
        let state = await AuthService.verifyEmail(req.user.id, otp)
        if (state) {
            res.status(200).json({ success: true, message: 'User Email Verified' });
        }
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}


exports.logout = (req, res) => {
    res.clearCookie('Jwt');
    res.status(200).json({ success: true, message: 'Logout successful' });
};
