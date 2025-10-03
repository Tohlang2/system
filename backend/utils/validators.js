const { query } = require('../config/database');

const validators = {
  isEmailUnique: async (email, excludeUserId = null) => {
    let sql = 'SELECT id FROM users WHERE email = $1';
    const params = [email];

    if (excludeUserId) {
      sql += ' AND id != $2';
      params.push(excludeUserId);
    }

    const result = await query(sql, params);
    return result.rows.length === 0;
  },

  isCourseCodeUnique: async (courseCode, excludeCourseId = null) => {
    let sql = 'SELECT id FROM courses WHERE course_code = $1';
    const params = [courseCode];

    if (excludeCourseId) {
      sql += ' AND id != $2';
      params.push(excludeCourseId);
    }

    const result = await query(sql, params);
    return result.rows.length === 0;
  },

  isValidFaculty: async (facultyId) => {
    const result = await query('SELECT id FROM faculties WHERE id = $1', [facultyId]);
    return result.rows.length > 0;
  },

  isValidCourse: async (courseId) => {
    const result = await query('SELECT id FROM courses WHERE id = $1 AND is_active = true', [courseId]);
    return result.rows.length > 0;
  },

  isValidUser: async (userId) => {
    const result = await query('SELECT id FROM users WHERE id = $1 AND is_active = true', [userId]);
    return result.rows.length > 0;
  },

  isUserLecturer: async (userId) => {
    const result = await query('SELECT id FROM users WHERE id = $1 AND role = $2 AND is_active = true', [userId, 'lecturer']);
    return result.rows.length > 0;
  },

  isUserStudent: async (userId) => {
    const result = await query('SELECT id FROM users WHERE id = $1 AND role = $2 AND is_active = true', [userId, 'student']);
    return result.rows.length > 0;
  }
};

module.exports = validators;