const express = require('express')
const router = express.Router()
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController')

router.post('/register/:role', register)
router.post('/login/:role', login)
router.post('/forgot-password/:role', forgotPassword)
router.post('/reset-password/:role', resetPassword)

module.exports = router