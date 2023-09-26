const { User, Person, ContactList } = require('../config/db')
const { Op } = require("sequelize");
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const CustomError = require('../utils/custom-errors')
const { getUpdatedToken } = require('../utils/googleTools')
const axios = require('axios');
const validator = require("validator");

function isValidPhoneNumber(phoneNumber) {
    try {
        const parsedPhoneNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, null); // Pass null for defaultRegion
        return phoneUtil.isValidNumber(parsedPhoneNumber);
    } catch (error) {
        return false;
    }
}

function isValidEmail(email) {
    return validator.isEmail(email);
}

class ContactService {
    async createList(title, type, owner) {
        if (!title) throw new CustomError('You must provide a title', 400)
        if (!type) throw new CustomError('You must provide a list type', 400)
        if (type !== "EMAIL" && type !== "PHONE") throw new CustomError('Invalid list type', 400)

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
        let newList = await ContactList.create({ title, type, owner })

        if (newList) {
            return true
        } else {
            return false
        }
    }

    async lists(owner) {
        let itemData = []
        let items = await ContactList.findAll({
            attributes: ['id', 'title', 'type'],
            where: {
                owner: owner
            }

        });

        for (const item of items) {
            let people = []
            if (item.type === "PHONE") {
                people = await Person.findAll({
                    attributes: ['id', 'name', 'phoneNumber'],
                    where: {
                        list: item.id
                    }
                });
            } else if (item.type === "EMAIL") {
                people = await Person.findAll({
                    attributes: ['id', 'name', 'EMAIL'],
                    where: {
                        list: item.id
                    }
                });
            }

            const itemdetails = { id: item.id, title: item.title, type: item.type, contacts: people }
            itemData.push(itemdetails)
        }
        return itemData
    }

    async addSinglePhone(name, phoneNumber, listId, owner) {
        if (!name) throw new CustomError('You must provide a name', 400)
        if (!phoneNumber) throw new CustomError('You must provide a phoneNumber', 400)
        if (!isValidPhoneNumber(phoneNumber)) throw new CustomError('Please provide a valid phone number', 400)
        phoneNumber = phoneNumber.replace(/\s/g, '')
        if (!listId) throw new CustomError('You must select a list', 400)

        let list = await ContactList.findOne({
            attributes: ['id', 'type'],
            where: {
                [Op.and]: [
                    { id: listId },
                    { owner: owner }
                ]
            }
        });
        if (!list) throw new CustomError('list does not exist', 400)
        if (list.type !== "PHONE") throw new CustomError('invalid list type', 400)
        await Person.create({ name, phoneNumber, list: listId })

        let newvalue = this.lists(owner)
        return newvalue
    }

    async addBatchPhone(batch, listId, owner) {
        if (!batch) throw new CustomError('You must provide a batch', 400)
        if (!listId) throw new CustomError('You must select a list', 400)

        let list = await ContactList.findOne({
            attributes: ['id', 'type'],
            where: {
                [Op.and]: [
                    { id: listId },
                    { owner: owner }
                ]
            }
        });
        if (!list) throw new CustomError('list does not exist', 400)
        if (list.type !== "PHONE") throw new CustomError('invalid list type', 400)

        for (const number of batch) {
            if (!number.name) throw new CustomError('csv not well formatted or has an error', 400)
            if (!number.phoneNumber) throw new CustomError('csv not well formatted or has an error', 400)
            if (!isValidPhoneNumber(number.phoneNumber)) throw new CustomError('csv not well formatted or has an error', 400)
            number.phoneNumber = number.phoneNumber.replace(/\s/g, '')
        }
        for (const number of batch) {
            await Person.create({ name: number.name, phoneNumber: number.phoneNumber, list: listId })
        }
        let newvalue = this.lists(owner)
        return newvalue
    }

    async addSingleEmail(name, email, listId, owner) {
        if (!name) throw new CustomError('You must provide a name', 400)
        if (!email) throw new CustomError('You must provide an email', 400)
        if (!isValidEmail(email)) throw new CustomError('Please provide a valid email', 400)

        if (!listId) throw new CustomError('You must select a list', 400)

        let list = await ContactList.findOne({
            attributes: ['id', 'type'],
            where: {
                [Op.and]: [
                    { id: listId },
                    { owner: owner }
                ]
            }
        });
        if (!list) throw new CustomError('list does not exist', 400)
        if (list.type !== "EMAIL") throw new CustomError('invalid list type', 400)
        await Person.create({ name, email, list: listId })

        let newvalue = this.lists(owner)
        return newvalue
    }

    async addBatchEmail(batch, listId, owner) {
        if (!batch) throw new CustomError('You must provide a batch', 400)
        if (!listId) throw new CustomError('You must select a list', 400)

        let list = await ContactList.findOne({
            attributes: ['id', 'type'],
            where: {
                [Op.and]: [
                    { id: listId },
                    { owner: owner }
                ]
            }
        });
        if (!list) throw new CustomError('list does not exist', 400)
        if (list.type !== "EMAIL") throw new CustomError('invalid list type', 400)

        for (const number of batch) {
            if (!number.name) throw new CustomError('csv not well formatted or has an error', 400)
            if (!number.email) throw new CustomError('csv not well formatted or has an error', 400)
            if (!isValidEmail(number.email)) throw new CustomError('csv not well formatted or has an error', 400)
        }
        for (const number of batch) {
            await Person.create({ name: number.name, email: number.email, list: listId })
        }
        let newvalue = this.lists(owner)
        return newvalue
    }

    async getGoogleContacts(owner) {
        let itemData = { contacts: [], count: 0 }
        const token = await getUpdatedToken(owner)
        if (token) {
            const apiUrl = 'https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers';
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            // Make the GET request to retrieve user's contacts
            const response = await axios.get(apiUrl, { headers });
            for (let contactKey in response.data.connections) {
                const contact = response.data.connections[contactKey];

                try {

                    itemData.contacts.push({
                        name: contact.names[0].displayName,
                        phoneNumber: contact.phoneNumbers[0].canonicalForm
                    });


                    // if (contact.names && contact.names[0].displayName && contact.phoneNumbers && contact.phoneNumbers[0].canonicalForm) {
                    //     itemData.contacts.push({
                    //         name: contact.names[0].displayName,
                    //         phoneNumber: contact.phoneNumbers[0].canonicalForm
                    //     });
                    // } else if ((!contact.names || !contact.names[0].displayName) && contact.phoneNumbers && contact.phoneNumbers[0].canonicalForm) {
                    //     itemData.contacts.push({
                    //         name: "",
                    //         phoneNumber: contact.phoneNumbers[0].canonicalForm
                    //     });
                    // }
                    // console.log(itemData)
                } catch (error) {
                    console.log("ERROR" + contact)
                }
            }
            itemData.count = itemData.contacts.length
            return itemData
        }

    }



}

module.exports = new ContactService()

