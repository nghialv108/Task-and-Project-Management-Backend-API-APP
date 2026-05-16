const env = require('../config/environment');

/**
 * Gửi email đơn giản qua SMTP.
 * Yêu cầu cấu hình SMTP_* trong .env.
 *
 * Để dùng thực tế: npm install nodemailer
 * và bỏ comment phần nodemailer bên dưới.
 */
const sendMail = async ({ to, subject, html }) => {
  if (env.NODE_ENV === 'development') {
    // Trong dev: chỉ log ra console, không cần SMTP thật
    console.log('[MAILER] ----------------------------');
    console.log(`[MAILER] To:      ${to}`);
    console.log(`[MAILER] Subject: ${subject}`);
    console.log(`[MAILER] Body:    ${html}`);
    console.log('[MAILER] ----------------------------');
    return;
  }

  // Production: dùng nodemailer
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({
  //   host: env.SMTP_HOST,
  //   port: env.SMTP_PORT,
  //   auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  // });
  // await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
};

const sendResetPasswordEmail = (to, resetLink) =>
  sendMail({
    to,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. The link expires in 15 minutes.</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });

module.exports = { sendMail, sendResetPasswordEmail };
