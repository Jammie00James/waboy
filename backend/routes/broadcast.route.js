const express = require('express')
const broadcastController = require('../controllers/broadcast.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();

router.post('/create', [authMiddleware.authenticateUser], broadcastController.create)
// router.post('/stop',[authMiddleware.authenticateUser] ,agentController.stop)
// router.post('/start',[authMiddleware.authenticateUser] ,agentController.start)
router.get('/list', [authMiddleware.authenticateUser], broadcastController.list)
router.get('/details/:id', [authMiddleware.authenticateUser], broadcastController.broadcastDetails)
router.delete('/delete', [authMiddleware.authenticateUser], broadcastController.delete)
// router.put('/update', [authMiddleware.authenticateUser], agentController.update)






module.exports = router