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


exports.generateAuthCode = async (req, res) => {
    try {
        const user = req.user
        let authorized = await AuthService.generateAuthCode()
        if (authorized) {
            res.redirect(authorized);
        }
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
};


exports.generateAuthCodeCallback = async (req, res) => {
    try {
        const { code, error } = req.query;
        const user = req.user
        if(!error){
            let success = await AuthService.generateAuthCodeCallback(code, user)
        }
        res.redirect('http://localhost:3000/k')
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
};

exports.removeOAuth2Client = async (req, res) => {
    try {
        const user = req.user
        const {id} = req.body
        let state = await AuthService.removeOAuth2Client(id, req.user.id)
        if (state) {
            res.status(200).json({ success: true, message: 'Google account removed successfully' });
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

