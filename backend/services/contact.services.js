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

            const itemdetails = { id: item.id, title: item.title, type: item.type, count: people.length }
            itemData.push(itemdetails)
        }
        return itemData
    }

    async listDetails(listId, owner) {
        if (!listId) throw new CustomError('You must provide a list id', 400)

        const item = await ContactList.findOne({
            attributes: ['id', 'title', 'type'],
            where: {
                [Op.and]: [
                    { id: listId },
                    { owner: owner }
                ]
            }
        });
        if (!item) throw new CustomError('List not found', 400)

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

        const itemdetails = { id: item.id, title: item.title, type: item.type, count: people.length, contacts: people }
        return itemdetails
    }

    async addSinglePhone(name, phoneNumber, listId) {
        if (!name) return null
        if (!phoneNumber) return null
        if (!isValidPhoneNumber(phoneNumber)) return null
        phoneNumber = phoneNumber.replace(/\s/g, '')
        if (!listId) return null

        let list = await ContactList.findOne({
            attributes: ['id', 'type'],
            where: {
                id: listId
            }
        });
        if (!list) return null
        if (list.type !== "PHONE") return null
        await Person.create({ name, phoneNumber, list: listId })

        return true
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
            const apiUrl = 'https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers&pageSize=1000&sortOrder=FIRST_NAME_ASCENDING';
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
                } catch (error) {

                }
            }
            console.log(response.data.connections.length)
            itemData.count = itemData.contacts.length
            return itemData
        }

    }

    async saveToListsFromAgent(person, lists) {
        // loop thro d array of list
        lists.forEach(async list => {
            let existingList = await Person.findOne({
                attributes: ['id'],
                where: {
                    [Op.and]: [
                        { phoneNumber: person.phoneNumber },
                        { list: list }
                    ]
                }
            });

            if (!existingList) {
                this.addSinglePhone(person.name, person.phoneNumber, list)
            }

        });
        // in each, check if user is alresdy
        // if yes, do nothing
        // if no, add to list
        // move on
    }

    async saveToContactsFromAgent(person, owner) {
        try {
            const token = await getUpdatedToken(owner)
            let newContact = {
                "names": [
                    {
                        "givenName": person.name
                    }
                ],
                "phoneNumbers": [
                    {
                        "value": person.number
                    }
                ]
            }
            const headers = {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            }

            axios.post('https://people.googleapis.com/v1/people:createContact', newContact, {
                headers: headers
            }).then(response => {
                console.log('Contact added successfully!');
            }).catch(error => {
                console.error('Failed to add a new contact:');
            });
        } catch (error) {
            console.log("error")
        }
    }

}

module.exports = new ContactService()

