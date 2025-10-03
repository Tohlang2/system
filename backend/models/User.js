const { query } = require('../config/database');

class User {
  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0];
  }

  static async create(userData) {
    const result = await query(
      `INSERT INTO users (
        email, password, first_name, last_name, role, faculty, department, student_id, employee_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id, email, first_name, last_name, role, faculty, department, student_id, employee_id, created_at`,
      [
        userData.email,
        userData.password,
        userData.first_name,
        userData.last_name,
        userData.role,
        userData.faculty,
        userData.department,
        userData.student_id,
        userData.employee_id
      ]
    );
    return result.rows[0];
  }

  // ... other methods
}

module.exports = User;