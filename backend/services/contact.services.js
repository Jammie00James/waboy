const { User, Person, ContactList } = require('../config/db')
const { Op } = require("sequelize");
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const CustomError = require('../utils/custom-errors')

function isValidPhoneNumber(phoneNumber) {
    try {
      const parsedPhoneNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, null); // Pass null for defaultRegion
      return phoneUtil.isValidNumber(parsedPhoneNumber);
    } catch (error) {
      return false;
    }
  }
  


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
        if(!isValidPhoneNumber(phoneNumber)) throw new CustomError('Please provide a valid phone number', 400)
        phoneNumber = phoneNumber.replace(/\s/g, '')
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

    async addBatch(batch, listId, owner) {
        if (!batch) throw new CustomError('You must provide a name', 400)
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

        for (const number of batch) {
            if (!number.name) throw new CustomError('csv not well formatted or has an error', 400)
            if(!number.phoneNumber) throw new CustomError('csv not well formatted or has an error', 400)
            if(!isValidPhoneNumber(number.phoneNumber)) throw new CustomError('csv not well formatted or has an error', 400)
            number.phoneNumber = number.phoneNumber.replace(/\s/g, '')
        }
        for (const number of batch) {
            await Person.create({ name:number.name, phoneNumber:number.phoneNumber, list: listId })   
        }
        let newvalue = this.lists(owner)
        return newvalue
    }

    async getGoogleContacts(owner) {
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



}

module.exports = new ContactService()

