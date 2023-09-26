const express = require('express')
const contactController = require('../controllers/contact.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();

router.post('/createList', [authMiddleware.authenticateUser],contactController.createList)
router.get('/lists',[authMiddleware.authenticateUser], contactController.lists)
router.post('/addSinglePhone',[authMiddleware.authenticateUser] ,contactController.addSinglePhone)
router.post('/addBatchPhone', [authMiddleware.authenticateUser] ,contactController.addBatchPhone)
router.post('/addSingleEmail',[authMiddleware.authenticateUser] ,contactController.addSingleEmail)
router.post('/addBatchEmail', [authMiddleware.authenticateUser] ,contactController.addBatchEmail)
router.get('/getGoogleContacts', [authMiddleware.authenticateUser], contactController.getGoogleContacts)
// router.delete('/delete', [authMiddleware.authenticateUser], agentController.delete)
// router.put('/update', [authMiddleware.authenticateUser], agentController.update)







module.exports = router