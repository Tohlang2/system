const express = require('express');
const classController = require('../controllers/classController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

const router = express.Router();

router.use(authenticateToken);

router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.post('/', requireRole(['program_leader']), classController.createClass);

module.exports = router;