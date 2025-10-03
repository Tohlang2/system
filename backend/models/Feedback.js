const { query } = require('../config/database');

class Feedback {
  static async create(feedbackData) {
    const result = await query(
      `INSERT INTO feedback (report_id, principal_lecturer_id, feedback_text, rating) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [feedbackData.report_id, feedbackData.principal_lecturer_id, feedbackData.feedback_text, feedbackData.rating]
    );
    return result.rows[0];
  }

  static async findByReport(reportId) {
    const result = await query(`
      SELECT f.*, 
             u.first_name || ' ' || u.last_name as principal_lecturer_name
      FROM feedback f
      LEFT JOIN users u ON f.principal_lecturer_id = u.id
      WHERE f.report_id = $1
      ORDER BY f.created_at DESC
    `, [reportId]);
    return result.rows;
  }

  static async findByPrincipalLecturer(principalLecturerId) {
    const result = await query(`
      SELECT f.*, 
             r.topic_taught,
             r.date_of_lecture,
             c.course_code,
             c.course_name,
             lect.first_name || ' ' || lect.last_name as lecturer_name
      FROM feedback f
      LEFT JOIN reports r ON f.report_id = r.id
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN users lect ON r.lecturer_id = lect.id
      WHERE f.principal_lecturer_id = $1
      ORDER BY f.created_at DESC
    `, [principalLecturerId]);
    return result.rows;
  }
}

module.exports = Feedback;