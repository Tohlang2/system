const express = require('express');
const authController = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/validation');

const router = express.Router();

router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegister, authController.register);

module.exports = router;