const express = require('express')
const authController = require('../controllers/auth.controller')
const authenticateUser = require('../middlewares/auth.middleware')
const router = express.Router();

router.post('/login',authController.login)
router.post('/logout',authController.logout)
router.post('/signup',authController.signup)
router.post('/email-verify', authenticateUser ,authController.emailVerify)
router.get('/email-verify/request', authenticateUser, authController.emailVerifyRequest)
// router.get('/me', Auth(ROLE[Roles.user], false), authController.me)
// router.put('/me',Auth(ROLE[Roles.user]),authController.updateMe)
// router.post('/password/reset', authController.resetPassword)
// router.post('/password/reset/request', authController.requestPssswordReset)
// router.post('/refresh', authController.refreshAuth)



module.exports = router