const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config/environment');

const authController = {
  login: async (req, res) => {
    // ... your existing login code
  },

  register: async (req, res) => {
    try {
      const { email, password, first_name, last_name, role, faculty, department, student_id, employee_id } = req.body;

      console.log('Registration attempt:', { email, role, first_name, last_name });

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        role,
        faculty,
        department,
        student_id,
        employee_id
      });

      // Generate token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name
        },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          faculty: user.faculty,
          department: user.department,
          student_id: user.student_id,
          employee_id: user.employee_id
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error during registration' });
    }
  }
};

module.exports = authController;