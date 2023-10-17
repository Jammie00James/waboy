const bcrypt = require('bcryptjs')
const { Agent, ContactList } = require('../config/db')
const config = require('../config/config.env')
const jwt = require('jsonwebtoken')
const { isDateTime } = require('../utils/tools')
const CustomError = require('../utils/custom-errors')
const { service, MailTemplate } = require('./mail.services')
const MailService = service
const { Op } = require("sequelize");
const axios = require('axios');

class BroadcastService {
    async verifyOptions(startdate, listid, agent, owner) {
        if(!startdate) throw new CustomError('start date is required', 400)
        if(!listid) throw new CustomError('list is required', 400)
        if(!agent) throw new CustomError('agent is required', 400)


        if(!isDateTime(startdate)) throw new CustomError('Invalid start date', 400)

        const list = await ContactList.findOne({
            attributes: ['id', 'type'],
            where: {
                [Op.and]: [
                    { id: listid },
                    { owner: owner }
                ]
            }
        });
        if (!list) throw new CustomError('target list not found', 400)
        if (list.type !== "PHONE") throw new CustomError('list type not supported', 400)


        const dbAgent = await Agent.findOne({
            attributes: ['id', 'state'],
            where: {
                [Op.and]: [
                    { id: agent },
                    { owner: owner }
                ]
            }
        });

        if (!dbAgent) throw new CustomError('agent not found', 400)
        if (dbAgent.state !== "RUNNING") throw new CustomError('Agent is not running', 400)

        return true
    }

}

module.exports = new BroadcastService()

