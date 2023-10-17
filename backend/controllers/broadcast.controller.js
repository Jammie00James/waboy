const BroadcastService = require('../services/broadcast.services')
const CustomError = require('../utils/custom-errors')
const { isValidBroadcastStruct } = require('../utils/agentTools')


exports.create = async (req, res) => {
    try {
        const user = req.user
        const { message, startdate, listid, agent } = req.body
        if (isValidBroadcastStruct(message)) {
            const verified = await BroadcastService.verifyOptions(startdate, listid, agent, user.id)
            if (verified) {
                let successful = await BroadcastService.create(message, startdate, listid, agent, user.id)
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
