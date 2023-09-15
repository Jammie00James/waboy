const ContactService = require('../services/contact.services')
const CustomError = require('../utils/custom-errors')


exports.createList = async (req, res) => {
    try {
        const user = req.user
        const {title} = req.body
        let created = await ContactService.createList(title,user.id)
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
        if(list){
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

exports.addSingle = async (req, res) => {
    try {
        const user = req.user
        const {name, phoneNumber, listId} =req.body
        let list = await ContactService.addSingle(name, phoneNumber, listId, user.id)
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
// exports.update = async (req, res) => {
//     try {
//         const data = req.body
//         let updated = await UserService.update(req.user.id, data)
//         if (updated) {
//             res.status(200).json({ "Message": "User Updated" })
//         }
//     } catch (error) {
//         if (error instanceof CustomError) {
//             res.status(error.status).json({ error: error.message });
//         } else {
//             console.error(error);
//             res.status(500).json({ error: 'An error occured' });
//         }
//     }
// }
