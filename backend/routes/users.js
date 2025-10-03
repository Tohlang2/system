const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

const router = express.Router();

router.use(authenticateToken);

router.get('/', requireRole(['program_leader', 'principal_lecturer']), userController.getAllUsers);
router.get('/me', userController.getCurrentUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);

module.exports = router;