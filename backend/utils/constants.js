const USER_ROLES = {
  STUDENT: 'student',
  LECTURER: 'lecturer',
  PRINCIPAL_LECTURER: 'principal_lecturer',
  PROGRAM_LEADER: 'program_leader'
};

const REPORT_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late'
};

const FACULTIES = {
  FICT: 'Faculty of Information Communication Technology',
  FBA: 'Faculty of Business Administration',
  FOE: 'Faculty of Engineering'
};

const ACADEMIC_YEARS = [
  '2023-2024',
  '2024-2025',
  '2025-2026'
];

const SEMESTERS = [
  'Semester 1',
  'Semester 2',
  'Summer Semester'
];

const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
};

module.exports = {
  USER_ROLES,
  REPORT_STATUS,
  ATTENDANCE_STATUS,
  FACULTIES,
  ACADEMIC_YEARS,
  SEMESTERS,
  DEFAULT_PAGINATION
};