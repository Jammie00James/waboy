const express = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();

router.post('/login',authController.login)
router.post('/logout',authController.logout)
router.post('/signup',authController.signup)
router.post('/email-verify',[authMiddleware.authenticateUser] ,authController.emailVerify)
router.get('/email-verify/request', [authMiddleware.authenticateUser], authController.emailVerifyRequest)




module.exports = router