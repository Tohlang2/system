const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert faculties
    console.log('Inserting faculties...');
    await query(`
      INSERT INTO faculties (faculty_name, faculty_code, description) VALUES 
      ('Faculty of Information Communication Technology', 'FICT', 'Faculty of ICT and Computer Science'),
      ('Faculty of Business Administration', 'FBA', 'Business and Management Studies'),
      ('Faculty of Engineering', 'FOE', 'Engineering and Technology')
      ON CONFLICT (faculty_code) DO NOTHING
    `);

    // Insert sample users with hashed passwords
    console.log('Inserting sample users...');
    const hashedPassword = await bcrypt.hash('password', 12);
    
    const users = [
      // Students
      ['student1@luct.com', hashedPassword, 'John', 'Student', 'student', 'FICT', 'Computer Science', 'STU001', null],
      ['student2@luct.com', hashedPassword, 'Sarah', 'Johnson', 'student', 'FBA', 'Business Management', 'STU002', null],
      
      // Lecturers
      ['lecturer1@luct.com', hashedPassword, 'Dr. Jane', 'Smith', 'lecturer', 'FICT', 'Computer Systems', null, 'LEC001'],
      ['lecturer2@luct.com', hashedPassword, 'Prof. Michael', 'Brown', 'lecturer', 'FICT', 'Software Engineering', null, 'LEC002'],
      
      // Principal Lecturers
      ['prl@luct.com', hashedPassword, 'Dr. Robert', 'Wilson', 'principal_lecturer', 'FICT', 'Academic Affairs', null, 'PRL001'],
      
      // Program Leader
      ['admin@luct.com', hashedPassword, 'Admin', 'User', 'program_leader', 'Administration', 'IT Services', null, 'ADM001']
    ];

    for (const user of users) {
      await query(`
        INSERT INTO users (email, password, first_name, last_name, role, faculty, department, student_id, employee_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (email) DO NOTHING
      `, user);
    }

    // Insert sample courses
    console.log('Inserting sample courses...');
    await query(`
      INSERT INTO courses (course_code, course_name, faculty_id, credits, description) VALUES 
      ('CS101', 'Introduction to Programming', 1, 3, 'Fundamentals of programming and algorithms'),
      ('CS202', 'Database Systems', 1, 4, 'Database design and management'),
      ('CS303', 'Web Development', 1, 3, 'Modern web development technologies'),
      ('BBA101', 'Business Management', 2, 3, 'Principles of business management'),
      ('ENG201', 'Electrical Circuits', 3, 4, 'Basic electrical circuit analysis')
      ON CONFLICT (course_code) DO NOTHING
    `);

    // Insert sample classes
    console.log('Inserting sample classes...');
    await query(`
      INSERT INTO classes (class_name, course_id, lecturer_id, faculty_id, total_registered_students, venue, schedule, academic_year, semester) VALUES 
      ('CS101-A', 1, 3, 1, 50, 'Building A, Room 101', 'Mon, Wed 9:00-10:30', '2024-2025', 'Semester 1'),
      ('CS202-B', 2, 3, 1, 45, 'Building A, Room 102', 'Tue, Thu 11:00-12:30', '2024-2025', 'Semester 1'),
      ('CS303-C', 3, 4, 1, 35, 'Building A, Room 201', 'Fri 14:00-17:00', '2024-2025', 'Semester 1'),
      ('BBA101-A', 4, 4, 2, 60, 'Building B, Room 301', 'Mon, Wed 14:00-15:30', '2024-2025', 'Semester 1')
      ON CONFLICT DO NOTHING
    `);

    // Insert sample reports
    console.log('Inserting sample reports...');
    await query(`
      INSERT INTO reports (
        faculty_name, class_name, week_of_reporting, date_of_lecture, course_id, lecturer_id, 
        actual_students_present, total_registered_students, venue, scheduled_lecture_time, 
        topic_taught, learning_outcomes, challenges, recommendations, status
      ) VALUES 
      (
        'Faculty of Information Communication Technology', 'CS101-A', 'Week 5', '2024-01-15', 1, 3,
        45, 50, 'Building A, Room 101', '09:00:00',
        'Introduction to Python Programming', 'Students should understand basic Python syntax, variables, and data types', 
        'Some students struggled with installing Python on their machines', 
        'Provide additional installation guides and setup assistance', 'approved'
      ),
      (
        'Faculty of Information Communication Technology', 'CS202-B', 'Week 6', '2024-01-16', 2, 3,
        38, 45, 'Building A, Room 102', '11:00:00',
        'SQL Queries and Database Design', 'Students should be able to write basic SQL queries and understand database normalization',
        'Complex JOIN operations were challenging for beginners',
        'Provide more practice exercises with step-by-step solutions', 'submitted'
      )
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData };