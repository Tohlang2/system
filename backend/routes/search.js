const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    let results = [];

    switch (type) {
      case 'reports':
        const reportsResult = await query(`
          SELECT r.*, c.course_code, c.course_name 
          FROM reports r 
          LEFT JOIN courses c ON r.course_id = c.id 
          WHERE r.topic_taught ILIKE $1 OR c.course_name ILIKE $1 OR c.course_code ILIKE $1
          ORDER BY r.created_at DESC
          LIMIT 20
        `, [`%${q}%`]);
        results = reportsResult.rows;
        break;

      case 'courses':
        const coursesResult = await query(`
          SELECT * FROM courses 
          WHERE course_name ILIKE $1 OR course_code ILIKE $1
          ORDER BY course_code
          LIMIT 20
        `, [`%${q}%`]);
        results = coursesResult.rows;
        break;

      case 'users':
        const usersResult = await query(`
          SELECT id, first_name, last_name, email, role, faculty 
          FROM users 
          WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1
          ORDER BY first_name, last_name
          LIMIT 20
        `, [`%${q}%`]);
        results = usersResult.rows;
        break;

      default:
        // Search across multiple types
        const [reports, courses, users] = await Promise.all([
          query(`SELECT 'report' as type, id, topic_taught as name, created_at as date FROM reports WHERE topic_taught ILIKE $1 LIMIT 5`, [`%${q}%`]),
          query(`SELECT 'course' as type, id, course_name as name, created_at as date FROM courses WHERE course_name ILIKE $1 LIMIT 5`, [`%${q}%`]),
          query(`SELECT 'user' as type, id, first_name || ' ' || last_name as name, created_at as date FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1 LIMIT 5`, [`%${q}%`])
        ]);

        results = [
          ...reports.rows,
          ...courses.rows,
          ...users.rows
        ];
    }

    res.json({
      success: true,
      query: q,
      type: type || 'all',
      results: results
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;