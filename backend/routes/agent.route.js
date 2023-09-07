const express = require('express')
const agentController = require('../controllers/agent.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();

router.post('/create', [authMiddleware.authenticateUser],agentController.create)
// router.post('/start', [authMiddleware.authenticateUser], agentController.start)
// router.post('/stop', [authMiddleware.authenticateUser], agentController.stop)
// router.post('/configure',[authMiddleware.authenticateUser] ,agentController.configure)
// router.get('/delete', [authMiddleware.authenticateUser], agentController.delete)




module.exports = router