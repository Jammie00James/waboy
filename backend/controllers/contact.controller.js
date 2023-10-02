const ContactService = require('../services/contact.services')
const CustomError = require('../utils/custom-errors')

exports.createList = async (req, res) => {
    try {
        const user = req.user
        const { title, type } = req.body
        let created = await ContactService.createList(title, type, user.id)
        if (created) {
            res.status(200).json({ message: 'List created' })
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

exports.lists = async (req, res) => {
    try {
        const user = req.user
        const list = await ContactService.lists(user.id)
        if (list) {
            res.status(200).json(list)
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

exports.listDetails = async (req, res) => {
    try {
        const user = req.user
        const id = req.params.id
        const list = await ContactService.listDetails(id, user.id)
        if (list) {
            res.status(200).json(list)
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



exports.addSinglePhone = async (req, res) => {
    try {
        const user = req.user
        const { name, phoneNumber, listId } = req.body
        let list = await ContactService.addSinglePhone(name, phoneNumber, listId, user.id)
        res.status(200).json(list)
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}

exports.addBatchPhone = async (req, res) => {
    try {
        const user = req.user
        const { batch, listId } = req.body
        let list = await ContactService.addBatchPhone(batch, listId, user.id)
        res.status(200).json(list)
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}

exports.addSingleEmail = async (req, res) => {
    try {
        const user = req.user
        const { name, email, listId } = req.body
        let list = await ContactService.addSingleEmail(name, email, listId, user.id)
        res.status(200).json(list)
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}

exports.addBatchEmail = async (req, res) => {
    try {
        const user = req.user
        const { batch, listId } = req.body
        let list = await ContactService.addBatchEmail(batch, listId, user.id)
        res.status(200).json(list)
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}

exports.getGoogleContacts = async (req, res) => {
    try {
        const user = req.user
        let list = await ContactService.getGoogleContacts(user.id)
        res.status(200).json(list)
    } catch (error) {
        if (error instanceof CustomError) {
            res.status(error.status).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'An error occured' });
        }
    }
}
