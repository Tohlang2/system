class Report {
  static async create(reportData) {
    const { query } = require('../config/database');
    const result = await query(
      `INSERT INTO reports (
        faculty_name, class_name, week_of_reporting, date_of_lecture, 
        course_id, lecturer_id, actual_students_present, total_registered_students,
        venue, scheduled_lecture_time, topic_taught, learning_outcomes,
        challenges, recommendations
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [...Object.values(reportData)]
    );
    return result.rows[0];
  }

  static async findByLecturer(lecturerId) {
    const { query } = require('../config/database');
    const result = await query(`
      SELECT r.*, c.course_code, c.course_name 
      FROM reports r 
      LEFT JOIN courses c ON r.course_id = c.id 
      WHERE r.lecturer_id = $1 
      ORDER BY r.created_at DESC
    `, [lecturerId]);
    return result.rows;
  }

  static async findById(id) {
    const { query } = require('../config/database');
    const result = await query(`
      SELECT r.*, c.course_code, c.course_name, 
             u.first_name || ' ' || u.last_name as lecturer_name
      FROM reports r
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN users u ON r.lecturer_id = u.id
      WHERE r.id = $1
    `, [id]);
    return result.rows[0];
  }
}

module.exports = Report;