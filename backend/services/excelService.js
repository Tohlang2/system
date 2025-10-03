const ExcelJS = require('exceljs');
const { query } = require('../config/database');

class ExcelService {
  static async generateReportExcel(reportId) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Lecture Report');

    // Get report data
    const reportResult = await query(`
      SELECT r.*, c.course_code, c.course_name, 
             u.first_name || ' ' || u.last_name as lecturer_name
      FROM reports r
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN users u ON r.lecturer_id = u.id
      WHERE r.id = $1
    `, [reportId]);

    if (reportResult.rows.length === 0) {
      throw new Error('Report not found');
    }

    const report = reportResult.rows[0];

    // Add title
    worksheet.mergeCells('A1:B1');
    worksheet.getCell('A1').value = 'LUCT FACULTY REPORTING SYSTEM - LECTURE REPORT';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Add headers and data
    const data = [
      ['Report ID', report.id],
      ['Faculty Name', report.faculty_name],
      ['Class Name', report.class_name],
      ['Week of Reporting', report.week_of_reporting],
      ['Date of Lecture', report.date_of_lecture],
      ['Course', `${report.course_code} - ${report.course_name}`],
      ['Lecturer', report.lecturer_name],
      ['Students Present', `${report.actual_students_present}/${report.total_registered_students}`],
      ['Attendance Percentage', `${Math.round((report.actual_students_present / report.total_registered_students) * 100)}%`],
      ['Venue', report.venue],
      ['Scheduled Time', report.scheduled_lecture_time],
      ['Topic Taught', report.topic_taught],
      ['Learning Outcomes', report.learning_outcomes],
      ['Challenges', report.challenges || 'N/A'],
      ['Recommendations', report.recommendations || 'N/A'],
      ['Status', report.status],
      ['Created Date', new Date(report.created_at).toLocaleDateString()]
    ];

    worksheet.addRows(data);

    // Style the worksheet
    worksheet.columns = [
      { width: 25 },
      { width: 50 }
    ];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.height = 25;
      }
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (rowNumber === 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F81BD' }
          };
          cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        }
      });
    });

    return workbook;
  }

  static async generateAllReportsExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('All Reports');

    // Get all reports
    const reportsResult = await query(`
      SELECT r.*, c.course_code, c.course_name, 
             u.first_name || ' ' || u.last_name as lecturer_name
      FROM reports r
      LEFT JOIN courses c ON r.course_id = c.id
      LEFT JOIN users u ON r.lecturer_id = u.id
      ORDER BY r.created_at DESC
    `);

    const reports = reportsResult.rows;

    // Add headers
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Course', key: 'course', width: 20 },
      { header: 'Class', key: 'class', width: 15 },
      { header: 'Lecturer', key: 'lecturer', width: 20 },
      { header: 'Topic', key: 'topic', width: 30 },
      { header: 'Attendance', key: 'attendance', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    // Add data
    reports.forEach(report => {
      worksheet.addRow({
        id: report.id,
        date: report.date_of_lecture,
        course: `${report.course_code} - ${report.course_name}`,
        class: report.class_name,
        lecturer: report.lecturer_name,
        topic: report.topic_taught,
        attendance: `${report.actual_students_present}/${report.total_registered_students}`,
        status: report.status
      });
    });

    // Style headers
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDDEBF7' }
      };
    });

    return workbook;
  }
}

module.exports = ExcelService;