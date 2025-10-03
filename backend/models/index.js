const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'lecturer', 'prl', 'pl'),
    allowNull: false
  },
  staffId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true
});

// Course Model
const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  course_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  course_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_registered_students: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: true
  },
  academic_year: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'courses',
  timestamps: true
});

// Class Model
const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  class_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  class_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  student_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  schedule: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: true
  },
  academic_year: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'classes',
  timestamps: true
});

// Report Model
const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  week_of_reporting: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 52
    }
  },
  date_of_lecture: {
    type: DataTypes.DATE,
    allowNull: false
  },
  actual_students_present: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  topic_taught: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  learning_outcomes: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  recommendations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prl_feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  feedback_given_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('submitted', 'reviewed', 'approved'),
    defaultValue: 'submitted'
  }
}, {
  tableName: 'reports',
  timestamps: true
});

// Define Relationships

// Course relationships
Course.belongsTo(User, { 
  foreignKey: 'assigned_lecturer_id', 
  as: 'lecturer' 
});
Course.belongsTo(User, { 
  foreignKey: 'assigned_prl_id', 
  as: 'prl' 
});

// Class relationships
Class.belongsTo(Course, { foreignKey: 'course_id' });
Class.belongsTo(User, { foreignKey: 'lecturer_id' });

// Report relationships
Report.belongsTo(Class, { foreignKey: 'class_id' });
Report.belongsTo(Course, { foreignKey: 'course_id' });
Report.belongsTo(User, { foreignKey: 'lecturer_id' });
Report.belongsTo(User, { 
  foreignKey: 'feedback_given_by', 
  as: 'feedbackBy' 
});

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Set force: true to drop and recreate tables
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Course,
  Class,
  Report,
  syncDatabase
};