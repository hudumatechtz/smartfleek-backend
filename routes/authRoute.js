const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// SHOP
router.post('/register', authController.postRegister);

// CUSTOMER
router.post('/signup', authController.postCustomerRegister);

module.exports = router;