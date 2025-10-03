const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (temporary - we'll add PostgreSQL later)
let users = [];
let courses = [];
let reports = [];
let nextId = 1;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LUCT Reporting System API is running',
    timestamp: new Date().toISOString(),
    database: 'In-Memory (PostgreSQL coming soon)'
  });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body);
    
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const user = {
      id: nextId++,
      name,
      email,
      password: hashedPassword,
      role,
      staffId: role !== 'student' ? `${role.toUpperCase()}${Date.now().toString().slice(-6)}` : null,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    console.log('✅ User registered successfully:', { id: user.id, name: user.name, email: user.email, role: user.role });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        staffId: user.staffId
      },
      token
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    console.log('✅ Login successful for user:', user.email);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        staffId: user.staffId
      },
      token
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Dashboard data endpoint
app.get('/api/dashboard', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Mock dashboard data based on user role
    let dashboardData = {};

    if (user.role === 'lecturer') {
      dashboardData = {
        total_reports: 12,
        total_classes: 4,
        total_courses: 3,
        pending_reports: 2,
        recent_reports: [
          {
            id: 1,
            course_name: "Web Development",
            course_code: "DIWA2110",
            class_name: "DIWA21A",
            topic_taught: "React Components",
            week_of_reporting: 5,
            date_of_lecture: "2024-01-15",
            actual_students_present: 25,
            learning_outcomes: "Students learned React component structure",
            created_at: "2024-01-15T10:00:00Z"
          }
        ]
      };
    } else if (user.role === 'student') {
      dashboardData = {
        enrolled_classes: 6,
        my_reports: []
      };
    } else if (user.role === 'prl') {
      dashboardData = {
        total_reports: 45,
        pending_reviews: 8,
        total_courses: 12,
        pending_reports_list: [
          {
            id: 2,
            course_name: "Database Systems",
            course_code: "DBSY2101",
            class_name: "DBSY21B",
            lecturer_name: "Dr. Smith",
            topic_taught: "SQL Queries",
            week_of_reporting: 5,
            date_of_lecture: "2024-01-16",
            actual_students_present: 30,
            learning_outcomes: "Advanced SQL query techniques",
            created_at: "2024-01-16T14:00:00Z"
          }
        ]
      };
    } else if (user.role === 'pl') {
      dashboardData = {
        total_reports: 120,
        total_courses: 25,
        total_classes: 40,
        recent_system_reports: [
          {
            id: 3,
            course_name: "Software Engineering",
            course_code: "SFEN2101",
            class_name: "SFEN21A",
            lecturer_name: "Prof. Johnson",
            topic_taught: "Agile Methodology",
            week_of_reporting: 5,
            date_of_lecture: "2024-01-17",
            actual_students_present: 28,
            learning_outcomes: "Understanding Agile principles",
            created_at: "2024-01-17T09:00:00Z"
          }
        ]
      };
    }

    res.json(dashboardData);

  } catch (error) {
    console.error('❌ Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});

// Get all users (for testing)
app.get('/api/users', (req, res) => {
  res.json({
    totalUsers: users.length,
    users: users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      staffId: u.staffId,
      createdAt: u.createdAt
    }))
  });
});

// Create course endpoint
app.post('/api/courses', (req, res) => {
  try {
    const { course_code, course_name, assigned_lecturer_id, assigned_prl_id, total_registered_students } = req.body;

    const course = {
      id: nextId++,
      course_code,
      course_name,
      assigned_lecturer_id,
      assigned_prl_id,
      total_registered_students,
      createdAt: new Date().toISOString()
    };

    courses.push(course);

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('❌ Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Get courses endpoint
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

// Create report endpoint
app.post('/api/reports', (req, res) => {
  try {
    const report = {
      id: nextId++,
      ...req.body,
      created_at: new Date().toISOString(),
      status: 'submitted'
    };
    reports.push(report);
    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    console.error('❌ Create report error:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Get my reports endpoint
app.get('/api/reports/my-reports', (req, res) => {
  res.json(reports);
});

// Get all reports endpoint
app.get('/api/reports', (req, res) => {
  res.json(reports);
});

// Update report feedback
app.patch('/api/reports/:id/feedback', (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;
    
    const report = reports.find(r => r.id == id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.prl_feedback = feedback;
    report.status = 'reviewed';

    res.json({
      message: 'Feedback added successfully',
      report
    });
  } catch (error) {
    console.error('❌ Update feedback error:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log('🚀 LUCT Reporting System Backend Started!');
  console.log('🚀 ========================================');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Register: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log('✅ Backend is ready and waiting for requests...');
  console.log('💾 Storage: In-Memory (Data will reset on server restart)');
});