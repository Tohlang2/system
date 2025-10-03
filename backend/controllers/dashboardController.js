const { query } = require('../config/database');

const dashboardController = {
  getDashboardStats: async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      let stats = {};

      switch (userRole) {
        case 'student':
          const studentStats = await query(`
            SELECT 
              (SELECT COUNT(*) FROM reports WHERE status = 'approved') as total_approved_reports,
              (SELECT COUNT(*) FROM ratings WHERE student_id = $1) as my_ratings_count,
              (SELECT COALESCE(AVG(rating_value), 0) FROM ratings WHERE student_id = $1) as my_avg_rating
            `, [userId]);
          stats = studentStats.rows[0];
          break;

        case 'lecturer':
          const lecturerStats = await query(`
            SELECT 
              COUNT(*) as total_reports,
              COUNT(CASE WHEN status = 'submitted' THEN 1 END) as pending_reviews,
              COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_reports,
              COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review_reports,
              COALESCE(AVG(actual_students_present::float / NULLIF(total_registered_students, 0)) * 100, 0) as avg_attendance_rate
            FROM reports 
            WHERE lecturer_id = $1
            `, [userId]);
          stats = lecturerStats.rows[0];
          break;

        case 'principal_lecturer':
          const prlStats = await query(`
            SELECT 
              COUNT(*) as total_reports,
              COUNT(CASE WHEN status = 'submitted' THEN 1 END) as pending_reviews,
              COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review_reports,
              COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_reports,
              (SELECT COUNT(*) FROM feedback WHERE principal_lecturer_id = $1) as feedback_given
            FROM reports
            `, [userId]);
          stats = prlStats.rows[0];
          break;

        case 'program_leader':
          const plStats = await query(`
            SELECT 
              COUNT(DISTINCT c.id) as total_courses,
              COUNT(DISTINCT u.id) as total_lecturers,
              COUNT(DISTINCT r.id) as total_reports,
              COUNT(DISTINCT s.id) as total_students,
              COALESCE(AVG(rat.rating_value), 0) as system_avg_rating
            FROM courses c
            CROSS JOIN (SELECT COUNT(*) as total_lecturers FROM users WHERE role = 'lecturer' AND is_active = true) u
            CROSS JOIN (SELECT COUNT(*) as total_reports FROM reports WHERE status = 'approved') r
            CROSS JOIN (SELECT COUNT(*) as total_students FROM users WHERE role = 'student' AND is_active = true) s
            LEFT JOIN ratings rat ON rat.rating_value IS NOT NULL
            `);
          stats = plStats.rows[0];
          break;
      }

      res.json({
        success: true,
        role: userRole,
        stats: stats
      });

    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ error: 'Failed to load dashboard statistics' });
    }
  }
};

module.exports = dashboardController;