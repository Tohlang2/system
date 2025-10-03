const { query } = require('../config/database');

class ReportService {
  static async getReportsWithFilters(filters = {}) {
    let sql = `
      SELECT r.*, 
             c.course_code, 
             c.course_name,
             u.first_name || ' ' || u.last_name as lecturer_name
      FROM reports r
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN users u ON r.lecturer_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    const { status, course_id, lecturer_id, faculty, start_date, end_date } = filters;

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

    if (lecturer_id) {
      paramCount++;
      sql += ` AND r.lecturer_id = $${paramCount}`;
      params.push(lecturer_id);
    }

    if (faculty) {
      paramCount++;
      sql += ` AND r.faculty_name ILIKE $${paramCount}`;
      params.push(`%${faculty}%`);
    }

    if (start_date) {
      paramCount++;
      sql += ` AND r.date_of_lecture >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      sql += ` AND r.date_of_lecture <= $${paramCount}`;
      params.push(end_date);
    }

    sql += ' ORDER BY r.created_at DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  static async getReportAnalytics(timeframe = 'month') {
    let dateFilter = '';
    switch (timeframe) {
      case 'week':
        dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'month':
        dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      case 'year':
        dateFilter = "AND created_at >= CURRENT_DATE - INTERVAL '365 days'";
        break;
    }

    const analytics = await query(`
      SELECT 
        COUNT(*) as total_reports,
        COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted_reports,
        COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review_reports,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_reports,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_reports,
        AVG(actual_students_present::float / NULLIF(total_registered_students, 0)) * 100 as avg_attendance_rate,
        COUNT(DISTINCT lecturer_id) as active_lecturers
      FROM reports 
      WHERE 1=1 ${dateFilter}
    `);

    return analytics.rows[0];
  }

  static async getLecturerPerformance(lecturerId) {
    const performance = await query(`
      SELECT 
        COUNT(*) as total_reports,
        AVG(actual_students_present::float / NULLIF(total_registered_students, 0)) * 100 as avg_attendance,
        AVG(r.rating_value) as avg_rating,
        COUNT(DISTINCT r.id) as total_ratings
      FROM reports rep
      LEFT JOIN ratings r ON rep.id = r.report_id
      WHERE rep.lecturer_id = $1
      GROUP BY rep.lecturer_id
    `, [lecturerId]);

    return performance.rows[0];
  }
}

module.exports = ReportService;