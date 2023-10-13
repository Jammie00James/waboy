const UserService = require('../services/user.services')
const CustomError = require('../utils/custom-errors')


exports.me = async (req, res) => {
    try {
        const user = req.user
        let me = await UserService.me(user.id)
        if (me) {
            res.status(200).json(me)
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

exports.update = async (req, res) => {
    try {
        const data = req.body
        let updated = await UserService.update(req.user.id, data)
        if (updated) {
            res.status(200).json({ "Message": "User Updated" })
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


exports.googleStatus = async (req, res) => {
    try {
        const user = req.user
        let connected = await UserService.googleStatus(user.id)
        if (!connected) {
            res.status(200).json({ connected : false})
        }else{
            res.status(200).json({ connected : true, email: connected.email})
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