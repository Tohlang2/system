const { query } = require('../config/database');

class Class {
  static async findAll(lecturerId = null) {
    let sql = `
      SELECT c.*, 
             co.course_code,
             co.course_name,
             u.first_name || ' ' || u.last_name as lecturer_name,
             f.faculty_name
      FROM classes c
      LEFT JOIN courses co ON c.course_id = co.id
      LEFT JOIN users u ON c.lecturer_id = u.id
      LEFT JOIN faculties f ON c.faculty_id = f.id
    `;
    const params = [];

    if (lecturerId) {
      sql += ' WHERE c.lecturer_id = $1';
      params.push(lecturerId);
    }

    sql += ' ORDER BY c.class_name';

    const result = await query(sql, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(`
      SELECT c.*, 
             co.course_code,
             co.course_name,
             u.first_name || ' ' || u.last_name as lecturer_name,
             f.faculty_name
      FROM classes c
      LEFT JOIN courses co ON c.course_id = co.id
      LEFT JOIN users u ON c.lecturer_id = u.id
      LEFT JOIN faculties f ON c.faculty_id = f.id
      WHERE c.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async create(classData) {
    const result = await query(
      `INSERT INTO classes (class_name, course_id, lecturer_id, faculty_id, total_registered_students, venue, schedule, academic_year, semester) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [classData.class_name, classData.course_id, classData.lecturer_id, 
       classData.faculty_id, classData.total_registered_students, classData.venue, 
       classData.schedule, classData.academic_year, classData.semester]
    );
    return result.rows[0];
  }
}

module.exports = Class;