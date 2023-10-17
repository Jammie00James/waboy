const service = require('../services/agent.services')
const AgentService = service
const CustomError = require('../utils/custom-errors')
const { isValidStruct } = require('../utils/agentTools')


exports.create = async (req, res) => {
    try {
        const user = req.user
        const options = req.body
        if (isValidStruct(options)) {
            const verified = await AgentService.verifyOptions(options, user.id)
            if (verified) {
                let clientid = await AgentService.generateclientId(user.id)
                let { client, qrString } = await AgentService.create(clientid, options, user.id)
                if (client) {
                    res.status(200).json({ "message": "Successful", qrString })
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

exports.delete = async (req, res) => {
    try {
        const user = req.user
        const id = req.body.id
        let deleted = await AgentService.delete(id, user.id)
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

exports.agentDetails = async (req, res) => {
    try {
        const user = req.user
        const id = req.params.id
        const details = await AgentService.details(id,user.id)
        res.status(200).json(details)
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
        const { options, id } = req.body


        if (isValidStruct(options)) {
            const verified = await AgentService.verifyOptions(options, user.id)
            if (verified) {
                const updated = await AgentService.update(id, options, user.id)
                if (updated) {
                    res.status(200).json({ "Message": "Agent Updated" })
                } else {
                    res.status(500).json({ error: 'An error occured' });
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

exports.stop = async (req, res) => {
    try {
        const user = req.user
        const {id} = req.body
        const stopped = await AgentService.stop(id, user.id)
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
        const id = req.body.id
        let { client, qrString } = await AgentService.start(id, user.id)
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