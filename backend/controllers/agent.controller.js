const service = require('../services/agent.services')
const AgentService = service
const CustomError = require('../utils/custom-errors')


exports.create = async (req, res) => {
    try {
        const user = req.user
        const prompt = req.body.prompts
        let clientid = await AgentService.generateclientId(user.id)
        let { client, qrString } = await AgentService.create(clientid, prompt, user.id)
        if (client) {
            res.status(200).json({ "message": "Successful", qrString })
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

exports.delete = async (req, res) => {
    try {
        const user = req.user
        const clientId = req.body.Id
        let deleted = await AgentService.delete(clientId, user.id)
        if (deleted) {
            res.status(200).json({ "Message": "Agent Deleted" })
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

exports.all = async (req, res) => {
    try {
        const user = req.user
        const agents = await AgentService.all(user.id)
        res.status(200).json(agents)
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
        const user = req.user
        const { prompts, Id } = req.body
        const updated = await AgentService.update(Id, prompts, user.id)
        if (updated) {
            res.status(200).json({ "Message": "Updated" })
        } else {
            res.status(500).json({ error: 'An error occured' });
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

exports.stop = async (req, res) => {
    try {
        const user = req.user
        const Id = req.body.Id
        const stopped = await AgentService.stop(Id,user.id)
        if (stopped) {
            res.status(200).json({ "Message": "Agent stopped" })
        } else {
            res.status(500).json({ error: 'An error occured' });
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

exports.start = async (req, res) => {
    try {
        const user = req.user
        const Id = req.body.Id
        let { client, qrString } = await AgentService.start(Id,user.id)
        if (client) {
            res.status(200).json({ "message": "Successful", qrString })
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