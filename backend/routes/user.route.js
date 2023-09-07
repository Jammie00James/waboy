const express = require('express')
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();

router.get('/me',[authMiddleware.authenticateUser],userController.me)
router.post('/update',[authMiddleware.authenticateUser],userController.update)




module.exports = router