const express = require('express')
const broadcastController = require('../controllers/broadcast.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();

router.post('/create', [authMiddleware.authenticateUser],broadcastController.create)
// router.post('/stop',[authMiddleware.authenticateUser] ,agentController.stop)
// router.post('/start',[authMiddleware.authenticateUser] ,agentController.start)
// router.get('/list', [authMiddleware.authenticateUser], agentController.all)
// router.get('/listdetails/:id', [authMiddleware.authenticateUser], agentController.agentDetails)
// router.delete('/delete', [authMiddleware.authenticateUser], agentController.delete)
// router.put('/update', [authMiddleware.authenticateUser], agentController.update)






module.exports = router