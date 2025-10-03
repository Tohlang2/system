const { query } = require('../config/database');

class Rating {
  static async create(ratingData) {
    const result = await query(
      `INSERT INTO ratings (report_id, student_id, rating_value, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [ratingData.report_id, ratingData.student_id, ratingData.rating_value, ratingData.comment]
    );
    return result.rows[0];
  }

  static async findByReport(reportId) {
    const result = await query(`
      SELECT r.*, 
             u.first_name || ' ' || u.last_name as student_name,
             u.student_id
      FROM ratings r
      LEFT JOIN users u ON r.student_id = u.id
      WHERE r.report_id = $1
      ORDER BY r.created_at DESC
    `, [reportId]);
    return result.rows;
  }

  static async findByStudent(studentId) {
    const result = await query(`
      SELECT r.*, 
             rep.topic_taught,
             rep.date_of_lecture,
             c.course_code,
             c.course_name,
             lect.first_name || ' ' || lect.last_name as lecturer_name
      FROM ratings r
      LEFT JOIN reports rep ON r.report_id = rep.id
      LEFT JOIN courses c ON rep.course_id = c.id
      LEFT JOIN users lect ON rep.lecturer_id = lect.id
      WHERE r.student_id = $1
      ORDER BY r.created_at DESC
    `, [studentId]);
    return result.rows;
  }

  static async getAverageRating(reportId) {
    const result = await query(`
      SELECT AVG(rating_value) as average_rating, COUNT(*) as total_ratings
      FROM ratings 
      WHERE report_id = $1
    `, [reportId]);
    return result.rows[0];
  }

  static async hasRated(reportId, studentId) {
    const result = await query(
      'SELECT id FROM ratings WHERE report_id = $1 AND student_id = $2',
      [reportId, studentId]
    );
    return result.rows.length > 0;
  }
}

module.exports = Rating;