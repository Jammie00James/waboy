const AgentService = require('../services/agent.services')
const CustomError = require('../utils/custom-errors')


exports.create = async (req, res) => {
    try {
        const user = req.user
        const prompt = req.body.prompts
        let { client, qrString } = await AgentService.create(user.id, prompt)
        if(client){
            console.log(client)
            res.status(200).json({"message": "Successful", qrString})
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
