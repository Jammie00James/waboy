const { User, Person, ContactList } = require('../config/db')
const { Op } = require("sequelize");
const CustomError = require('../utils/custom-errors')


class ContactService {
    async createList(title, owner) {
        if (!title) throw new CustomError('You must provide a title', 400)
        //Check if list already exists for user, 
        //if yes throw custom error
        // try to create new list,return true
        let oldList = await ContactList.findOne({
            attributes: ['id'],
            where: {
                [Op.and]: [
                    { title: title },
                    { owner: owner }
                ]
            }
        });

        if (oldList) throw new CustomError('Title already used', 400)
        let newList = await ContactList.create({ title, owner })

        if (newList) {
            return true
        } else {
            return false
        }
    }

    async lists(owner) {
        let itemData = []
        let items = await ContactList.findAll({
            attributes: ['id', 'title'],
            where: {
                owner: owner
            }

        });

        for (const item of items) {
            const people = await Person.findAll({
                attributes: ['id', 'name', 'phoneNumber'],
                where: {
                    list: item.id
                }
            });
            const itemdetails = { id: item.id, title: item.title, contacts: people }
            itemData.push(itemdetails)
        }
        return itemData
    }

    async addSingle(name, phoneNumber, listId, owner) {
        if (!name) throw new CustomError('You must provide a name', 400)
        if (!phoneNumber) throw new CustomError('You must provide a phoneNumber', 400)
        if (!listId) throw new CustomError('You must select a list', 400)

        let list = await ContactList.findOne({
            attributes: ['id'],
            where: {
                [Op.and]: [
                    { id: listId },
                    { owner: owner }
                ]
            }
        });
        if (!list) throw new CustomError('list does not exist', 400)
        await Person.create({ name, phoneNumber, list: listId })

        let newvalue = this.lists(owner)
        return newvalue
    }
}

module.exports = new ContactService()

