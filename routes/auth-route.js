const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const isAuth = require('../middlewares/is-auth');

// SHOP
router.post('/register', authController.postRegister);

// CUSTOMER
router.post('/signup', authController.postCustomerRegister);

//LOGIN FOR BOTH
router.post('/login', authController.postLogin);

// VERIFICATION
router.get('/activation/:token', authController.getVerification);
module.exports = router;