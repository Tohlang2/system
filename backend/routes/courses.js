const express = require('express');
const courseController = require('../controllers/courseController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

const router = express.Router();

router.use(authenticateToken);

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', requireRole(['program_leader']), courseController.createCourse);
router.put('/:id', requireRole(['program_leader']), courseController.updateCourse);

module.exports = router;