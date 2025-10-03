const express = require('express');
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { validateReport } = require('../middleware/validation');

const router = express.Router();

router.use(authenticateToken);

router.get('/', reportController.getAllReports);
router.post('/', requireRole(['lecturer']), validateReport, reportController.createReport);
router.get('/:id', reportController.getReportById);

module.exports = router;