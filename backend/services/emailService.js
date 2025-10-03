const nodemailer = require('nodemailer');
const { email } = require('../config/environment');

class EmailService {
  static transporter = nodemailer.createTransporter({
    host: email.host,
    port: email.port,
    secure: false,
    auth: {
      user: email.user,
      pass: email.pass,
    },
  });

  static async sendNotification(to, subject, message) {
    if (!email.user || !email.pass) {
      console.log('Email not configured. Would send:', { to, subject, message });
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"LUCT Reporting System" <${email.user}>`,
        to,
        subject,
        html: message,
      });
      console.log('Notification email sent to:', to);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  static async sendReportSubmittedNotification(report, lecturer) {
    const subject = 'New Report Submitted - LUCT Reporting System';
    const message = `
      <h2>New Lecture Report Submitted</h2>
      <p><strong>Lecturer:</strong> ${lecturer.first_name} ${lecturer.last_name}</p>
      <p><strong>Course:</strong> ${report.course_code} - ${report.course_name}</p>
      <p><strong>Class:</strong> ${report.class_name}</p>
      <p><strong>Date:</strong> ${report.date_of_lecture}</p>
      <p><strong>Topic:</strong> ${report.topic_taught}</p>
      <br>
      <p>Please review the report in the system.</p>
    `;

    // This would typically send to PRLs or relevant staff
    console.log('Report submission notification:', { subject, message });
  }

  static async sendFeedbackNotification(report, feedback, student) {
    const subject = 'Feedback Received on Your Report';
    const message = `
      <h2>Feedback Received</h2>
      <p><strong>Course:</strong> ${report.course_code} - ${report.course_name}</p>
      <p><strong>Date:</strong> ${report.date_of_lecture}</p>
      <p><strong>Feedback:</strong> ${feedback.feedback_text}</p>
      <br>
      <p>Please check the system for details.</p>
    `;

    // This would send to the lecturer
    console.log('Feedback notification:', { subject, message });
  }
}

module.exports = EmailService;