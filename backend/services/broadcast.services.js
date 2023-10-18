const bcrypt = require('bcryptjs')
const { Agent, Broadcast, ContactList } = require('../config/db')
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
        if (!startdate) throw new CustomError('start date is required', 400)
        if (!listid) throw new CustomError('list is required', 400)
        if (!agent) throw new CustomError('agent is required', 400)


        if (!isDateTime(startdate)) throw new CustomError('Invalid start date', 400)

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

    async create(name, message, startdate, listid, agent, owner) {
        if (!name) throw new CustomError("there must be a name", 400)

        const broadcast = await Broadcast.findOne({
            attributes: ['id'],
            where: {
                [Op.and]: [
                    { name: name },
                    { owner: owner }
                ]
            }
        });

        if (broadcast) throw new CustomError('name already exists', 400)

        const refinedMessage = JSON.stringify(message)
        const newClient = await Broadcast.create({ name, status: "PENDING", message: refinedMessage, count: '0', scheduledFor: startdate, finishedAt: null, agent, owner, contactlist: listid })
        if (newClient) {
            return true
        }

    }

    async list(owner) {

        const broadcasts = await Broadcast.findAll({
            attributes: ['id', 'name', 'status', 'scheduledFor'],
            where: {
                owner: owner
            }
        });

        return broadcasts
    }

    async delete(id, owner) {
        if (!id) throw new CustomError('No bradcast id specified', 400)

        const broadcast = await Broadcast.findOne({
            attributes: ['id', 'status'],
            where: {
                [Op.and]: [
                    { id: id },
                    { owner: owner }
                ]
            }
        });
        if (!broadcast) throw new CustomError('Broadcast not found', 400)
        if (broadcast.status === "STARTED") throw new CustomError('Broadcast has started and cant be deleted', 400)

        await Broadcast.destroy({
            where: {
                id: id
            }
        });

        const list = await this.list(owner)
        return list

    }

    async broadcastDetails(id, owner) {
        if (!id) throw new CustomError('You must provide a Broadcast id', 400)

        const item = await Broadcast.findOne({
            attributes: ['id', 'name', 'status', 'message', 'count', 'scheduledFor', 'finishedAt', 'createdAt', 'agent', 'contactlist'],
            where: {
                [Op.and]: [
                    { id: id },
                    { owner: owner }
                ]
            }
        });
        if (!item) throw new CustomError('List not found', 400)
        item.message = JSON.parse(item.message)


        return item
    }




}

module.exports = new BroadcastService()

