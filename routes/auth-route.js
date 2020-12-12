const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

// SHOP
router.post('/register', authController.postRegister);

// CUSTOMER
router.post('/signup', authController.postCustomerRegister);

//LOGIN FOR BOTH
router.post('/login', authController.postLogin);

module.exports = router;