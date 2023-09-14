const express = require('express')
const agentController = require('../controllers/agent.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();

router.post('/create', [authMiddleware.authenticateUser],agentController.create)
router.get('/all', [authMiddleware.authenticateUser], agentController.all)
router.put('/update', [authMiddleware.authenticateUser], agentController.update)
router.post('/stop',[authMiddleware.authenticateUser] ,agentController.stop)
router.post('/start',[authMiddleware.authenticateUser] ,agentController.start)
router.delete('/delete', [authMiddleware.authenticateUser], agentController.delete)




module.exports = router