const express = require('express')
const contactController = require('../controllers/contact.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();

router.post('/createList', [authMiddleware.authenticateUser],contactController.createList)
router.get('/lists',[authMiddleware.authenticateUser], contactController.lists)
router.post('/addSingle',[authMiddleware.authenticateUser] ,contactController.addSingle)
router.post('/addBatch', [authMiddleware.authenticateUser] ,contactController.addBatch)
//router.get('/addFromCSV', [authMiddleware.authenticateUser], agentController.all)
// router.delete('/delete', [authMiddleware.authenticateUser], agentController.delete)
// router.put('/update', [authMiddleware.authenticateUser], agentController.update)







module.exports = router