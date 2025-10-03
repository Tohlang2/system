const express = require('express');
const ratingController = require('../controllers/ratingController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { validateRating } = require('../middleware/validation');

const router = express.Router();

router.use(authenticateToken);

router.post('/', requireRole(['student']), validateRating, ratingController.createRating);
router.get('/my-ratings', requireRole(['student']), ratingController.getMyRatings);
router.get('/report/:reportId', ratingController.getRatingsByReport);
router.get('/report/:reportId/average', ratingController.getAverageRating);

module.exports = router;