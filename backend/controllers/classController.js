const Class = require('../models/Class');

const classController = {
  getAllClasses: async (req, res) => {
    try {
      let classes;
      
      // Role-based filtering
      if (req.user.role === 'lecturer') {
        classes = await Class.findAll(req.user.id);
      } else {
        classes = await Class.findAll();
      }

      res.json({
        success: true,
        data: classes
      });

    } catch (error) {
      console.error('Get classes error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getClassById: async (req, res) => {
    try {
      const { id } = req.params;
      const classItem = await Class.findById(id);

      if (!classItem) {
        return res.status(404).json({ error: 'Class not found' });
      }

      res.json({
        success: true,
        data: classItem
      });

    } catch (error) {
      console.error('Get class error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createClass: async (req, res) => {
    try {
      const classData = req.body;
      const classItem = await Class.create(classData);

      res.status(201).json({
        success: true,
        data: classItem,
        message: 'Class created successfully'
      });

    } catch (error) {
      console.error('Create class error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = classController;