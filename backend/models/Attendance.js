const { query } = require('../config/database');

class Attendance {
  static async create(attendanceData) {
    const result = await query(
      `INSERT INTO attendance (report_id, student_id, status) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [attendanceData.report_id, attendanceData.student_id, attendanceData.status]
    );
    return result.rows[0];
  }

  static async findByReport(reportId) {
    const result = await query(`
      SELECT a.*, 
             u.first_name || ' ' || u.last_name as student_name,
             u.student_id
      FROM attendance a
      LEFT JOIN users u ON a.student_id = u.id
      WHERE a.report_id = $1
      ORDER BY u.first_name, u.last_name
    `, [reportId]);
    return result.rows;
  }

  static async getReportAttendanceSummary(reportId) {
    const result = await query(`
      SELECT 
        COUNT(*) as total_students,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count
      FROM attendance 
      WHERE report_id = $1
    `, [reportId]);
    return result.rows[0];
  }
}

module.exports = Attendance;