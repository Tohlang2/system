const Course = require('../models/Course');

const courseController = {
  getAllCourses: async (req, res) => {
    try {
      const { faculty_id } = req.query;
      let courses;

      if (faculty_id) {
        courses = await Course.findByFaculty(faculty_id);
      } else {
        courses = await Course.findAll();
      }

      res.json({
        success: true,
        data: courses
      });

    } catch (error) {
      console.error('Get courses error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      res.json({
        success: true,
        data: course
      });

    } catch (error) {
      console.error('Get course error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createCourse: async (req, res) => {
    try {
      const courseData = req.body;
      const course = await Course.create(courseData);

      res.status(201).json({
        success: true,
        data: course,
        message: 'Course created successfully'
      });

    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const courseData = req.body;

      const existingCourse = await Course.findById(id);
      if (!existingCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const course = await Course.update(id, courseData);

      res.json({
        success: true,
        data: course,
        message: 'Course updated successfully'
      });

    } catch (error) {
      console.error('Update course error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = courseController;