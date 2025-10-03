const { query } = require('../config/database');

class Faculty {
  static async findAll() {
    const result = await query('SELECT * FROM faculties ORDER BY faculty_name');
    return result.rows;
  }

  static async findById(id) {
    const result = await query('SELECT * FROM faculties WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(facultyData) {
    const result = await query(
      'INSERT INTO faculties (faculty_name, faculty_code, description) VALUES ($1, $2, $3) RETURNING *',
      [facultyData.faculty_name, facultyData.faculty_code, facultyData.description]
    );
    return result.rows[0];
  }
}

module.exports = Faculty;