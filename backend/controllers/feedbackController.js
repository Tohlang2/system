const Feedback = require('../models/Feedback');
const { query } = require('../config/database');

const feedbackController = {
  createFeedback: async (req, res) => {
    try {
      const feedbackData = {
        ...req.body,
        principal_lecturer_id: req.user.id
      };

      const feedback = await Feedback.create(feedbackData);

      // Update report status to under_review
      await query(
        'UPDATE reports SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        ['under_review', feedbackData.report_id]
      );

      res.status(201).json({
        success: true,
        data: feedback,
        message: 'Feedback submitted successfully'
      });

    } catch (error) {
      console.error('Create feedback error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getFeedbackByReport: async (req, res) => {
    try {
      const { reportId } = req.params;
      const feedback = await Feedback.findByReport(reportId);

      res.json({
        success: true,
        data: feedback
      });

    } catch (error) {
      console.error('Get feedback error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getMyFeedback: async (req, res) => {
    try {
      const feedback = await Feedback.findByPrincipalLecturer(req.user.id);

      res.json({
        success: true,
        data: feedback
      });

    } catch (error) {
      console.error('Get my feedback error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = feedbackController;