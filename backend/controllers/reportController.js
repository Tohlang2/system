const Report = require('../models/Report');
const { query } = require('../config/database');

const reportController = {
  getAllReports: async (req, res) => {
    try {
      const { status, course_id } = req.query;
      let sql = `
        SELECT r.*, c.course_code, c.course_name, 
               u.first_name || ' ' || u.last_name as lecturer_name
        FROM reports r
        LEFT JOIN courses c ON r.course_id = c.id
        LEFT JOIN users u ON r.lecturer_id = u.id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 0;

      // Role-based filtering
      if (req.user.role === 'lecturer') {
        paramCount++;
        sql += ` AND r.lecturer_id = $${paramCount}`;
        params.push(req.user.id);
      }

      if (status) {
        paramCount++;
        sql += ` AND r.status = $${paramCount}`;
        params.push(status);
      }

      if (course_id) {
        paramCount++;
        sql += ` AND r.course_id = $${paramCount}`;
        params.push(course_id);
      }

      sql += ' ORDER BY r.created_at DESC';

      const result = await query(sql, params);
      
      res.json({
        success: true,
        data: result.rows
      });

    } catch (error) {
      console.error('Get reports error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createReport: async (req, res) => {
    try {
      const reportData = {
        ...req.body,
        lecturer_id: req.user.id
      };

      const report = await Report.create(reportData);

      // Get course details
      const courseResult = await query(
        'SELECT course_code, course_name FROM courses WHERE id = $1',
        [reportData.course_id]
      );

      res.status(201).json({
        success: true,
        data: {
          ...report,
          course_code: courseResult.rows[0]?.course_code,
          course_name: courseResult.rows[0]?.course_name,
          lecturer_name: req.user.first_name + ' ' + req.user.last_name
        }
      });

    } catch (error) {
      console.error('Create report error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getReportById: async (req, res) => {
    try {
      const { id } = req.params;
      const report = await Report.findById(id);

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.json({
        success: true,
        data: report
      });

    } catch (error) {
      console.error('Get report error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = reportController;