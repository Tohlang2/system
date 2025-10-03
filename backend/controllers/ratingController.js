const Rating = require('../models/Rating');

const ratingController = {
  createRating: async (req, res) => {
    try {
      const ratingData = {
        ...req.body,
        student_id: req.user.id
      };

      // Check if student has already rated this report
      const hasRated = await Rating.hasRated(ratingData.report_id, req.user.id);
      if (hasRated) {
        return res.status(400).json({ error: 'You have already rated this report' });
      }

      const rating = await Rating.create(ratingData);

      res.status(201).json({
        success: true,
        data: rating,
        message: 'Rating submitted successfully'
      });

    } catch (error) {
      console.error('Create rating error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getRatingsByReport: async (req, res) => {
    try {
      const { reportId } = req.params;
      const ratings = await Rating.findByReport(reportId);

      res.json({
        success: true,
        data: ratings
      });

    } catch (error) {
      console.error('Get ratings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getMyRatings: async (req, res) => {
    try {
      const ratings = await Rating.findByStudent(req.user.id);

      res.json({
        success: true,
        data: ratings
      });

    } catch (error) {
      console.error('Get my ratings error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAverageRating: async (req, res) => {
    try {
      const { reportId } = req.params;
      const averageRating = await Rating.getAverageRating(reportId);

      res.json({
        success: true,
        data: averageRating
      });

    } catch (error) {
      console.error('Get average rating error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = ratingController;