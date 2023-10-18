const BroadcastService = require('../services/broadcast.services')
const CustomError = require('../utils/custom-errors')
const { isValidBroadcastStruct } = require('../utils/agentTools')


exports.create = async (req, res) => {
    try {
        const user = req.user
        const { name, message, startdate, listid, agent } = req.body
        if (isValidBroadcastStruct(message)) {
            const verified = await BroadcastService.verifyOptions(startdate, listid, agent, user.id)
            if (verified) {
                const successful = await BroadcastService.create(name, message, startdate, listid, agent, user.id)
                if (successful) {
                    res.status(200).json({ "message": "Successful" })
                }
            }
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


exports.list = async (req, res) => {
    try {
        const user = req.user
        const lists = await BroadcastService.list(user.id)
        res.status(200).json(lists)

    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}

exports.delete = async (req, res) => {
    try {
        const user = req.user
        const {id} = req.body
        const lists = await BroadcastService.delete(id, user.id)
        res.status(200).json(lists)

    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}

exports.broadcastDetails = async (req, res) => {
    try {
        const user = req.user
        const id = req.params.id
        const details = await BroadcastService.broadcastDetails(id, user.id)
        if (details) {
            res.status(200).json(details)
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