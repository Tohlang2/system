const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;