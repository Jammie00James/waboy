const express = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router();

router.post('/login',authController.login)
router.post('/logout',authController.logout)
router.post('/signup',authController.signup)
router.post('/email-verify',[authMiddleware.authenticateUser] ,authController.emailVerify)
router.get('/email-verify/request', [authMiddleware.authenticateUser], authController.emailVerifyRequest)
router.get('/oAuth2Client', [authMiddleware.authenticateUser, authMiddleware.validateGoogle], authController.generateAuthCode)
router.get('/oAuth2ClientCallback', [authMiddleware.authenticateUser, authMiddleware.validateGoogle],authController.generateAuthCodeCallback)




module.exports = router