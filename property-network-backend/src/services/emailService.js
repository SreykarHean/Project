require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
})

const sendResetEmail = async (toEmail, resetToken, role) => {
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&role=${role}`

  await transporter.sendMail({
    from: `"Property Network" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset</h2>
      <p>You requested a password reset for your Property Network account.</p>
      <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  })
}

module.exports = { sendResetEmail }