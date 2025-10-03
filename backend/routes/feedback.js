const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { validateFeedback } = require('../middleware/validation');

const router = express.Router();

router.use(authenticateToken);

router.post('/', requireRole(['principal_lecturer']), validateFeedback, feedbackController.createFeedback);
router.get('/my-feedback', requireRole(['principal_lecturer']), feedbackController.getMyFeedback);
router.get('/report/:reportId', feedbackController.getFeedbackByReport);

module.exports = router;