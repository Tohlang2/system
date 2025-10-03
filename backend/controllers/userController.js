const User = require('../models/User');
const { query } = require('../config/database');

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const { role } = req.query;
      let sql = `
        SELECT id, first_name, last_name, email, role, faculty, department, 
               student_id, employee_id, created_at
        FROM users 
        WHERE is_active = true
      `;
      const params = [];

      if (role) {
        sql += ' AND role = $1';
        params.push(role);
      }

      sql += ' ORDER BY first_name, last_name';

      const result = await query(sql, params);
      
      res.json({
        success: true,
        data: result.rows
      });

    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { first_name, last_name, faculty, department } = req.body;

      // Check if user exists and is active
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const result = await query(
        `UPDATE users 
         SET first_name = $1, last_name = $2, faculty = $3, department = $4, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $5 
         RETURNING id, first_name, last_name, email, role, faculty, department`,
        [first_name, last_name, faculty, department, id]
      );

      res.json({
        success: true,
        data: result.rows[0],
        message: 'User updated successfully'
      });

    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userController;