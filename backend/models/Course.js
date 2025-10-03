const { query } = require('../config/database');

class Course {
  static async findAll() {
    const result = await query(`
      SELECT c.*, f.faculty_name 
      FROM courses c 
      LEFT JOIN faculties f ON c.faculty_id = f.id 
      WHERE c.is_active = true
      ORDER BY c.course_code
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(`
      SELECT c.*, f.faculty_name 
      FROM courses c 
      LEFT JOIN faculties f ON c.faculty_id = f.id 
      WHERE c.id = $1 AND c.is_active = true
    `, [id]);
    return result.rows[0];
  }

  static async findByFaculty(facultyId) {
    const result = await query(`
      SELECT c.*, f.faculty_name 
      FROM courses c 
      LEFT JOIN faculties f ON c.faculty_id = f.id 
      WHERE c.faculty_id = $1 AND c.is_active = true
      ORDER BY c.course_code
    `, [facultyId]);
    return result.rows;
  }

  static async create(courseData) {
    const result = await query(
      `INSERT INTO courses (course_code, course_name, faculty_id, credits, description, program_leader_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [courseData.course_code, courseData.course_name, courseData.faculty_id, 
       courseData.credits, courseData.description, courseData.program_leader_id]
    );
    return result.rows[0];
  }

  static async update(id, courseData) {
    const result = await query(
      `UPDATE courses 
       SET course_code = $1, course_name = $2, faculty_id = $3, credits = $4, description = $5, 
           program_leader_id = $6, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $7 
       RETURNING *`,
      [courseData.course_code, courseData.course_name, courseData.faculty_id, 
       courseData.credits, courseData.description, courseData.program_leader_id, id]
    );
    return result.rows[0];
  }
}

module.exports = Course;