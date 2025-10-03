const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { email, password, first_name, last_name, role } = req.body;

  if (!email || !password || !first_name || !last_name || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const validRoles = ['student', 'lecturer', 'principal_lecturer', 'program_leader'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  next();
};

const validateReport = (req, res, next) => {
  const {
    faculty_name,
    class_name,
    week_of_reporting,
    date_of_lecture,
    course_id,
    actual_students_present,
    total_registered_students,
    venue,
    scheduled_lecture_time,
    topic_taught,
    learning_outcomes
  } = req.body;

  if (!faculty_name || !class_name || !week_of_reporting || !date_of_lecture || 
      !course_id || !actual_students_present || !total_registered_students ||
      !venue || !scheduled_lecture_time || !topic_taught || !learning_outcomes) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  if (actual_students_present > total_registered_students) {
    return res.status(400).json({ error: 'Present students cannot exceed total registered students' });
  }

  next();
};

const validateRating = (req, res, next) => {
  const { report_id, rating_value } = req.body;

  if (!report_id || !rating_value) {
    return res.status(400).json({ error: 'Report ID and rating value are required' });
  }

  if (rating_value < 1 || rating_value > 5) {
    return res.status(400).json({ error: 'Rating value must be between 1 and 5' });
  }

  next();
};

const validateFeedback = (req, res, next) => {
  const { report_id, feedback_text } = req.body;

  if (!report_id || !feedback_text) {
    return res.status(400).json({ error: 'Report ID and feedback text are required' });
  }

  if (feedback_text.length < 10) {
    return res.status(400).json({ error: 'Feedback text must be at least 10 characters' });
  }

  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  validateReport,
  validateRating,
  validateFeedback
};