const crypto = require('crypto')
const { sendResetEmail } = require('./emailService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Admin, Agent, Buyer } = require('../models')

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

const register = async (role, data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10)
  data.password = hashedPassword

  let user
  if (role === 'buyer') user = await Buyer.create(data)
  else if (role === 'agent') user = await Agent.create(data)
  else if (role === 'admin') user = await Admin.create(data)
  else throw new Error('Invalid role')

  const idField = `${role}_id`
  const token = generateToken(user[idField], role)

  return { token }
}

const login = async (role, email, password) => {
  let user
  if (role === 'buyer') user = await Buyer.findOne({ where: { email } })
  else if (role === 'agent') user = await Agent.findOne({ where: { email } })
  else if (role === 'admin') user = await Admin.findOne({ where: { email } })
  else throw new Error('Invalid role')

  if (!user) throw new Error('User not found')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Invalid credentials')

  const idField = `${role}_id`
  const token = generateToken(user[idField], role)

  return { token }
}

const forgotPassword = async (role, email) => {
  let Model
  if (role === 'buyer') Model = Buyer
  else if (role === 'agent') Model = Agent
  else if (role === 'admin') Model = Admin
  else throw new Error('Invalid role')

  const user = await Model.findOne({ where: { email } })
  if (!user) throw new Error('No account found with this email')

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

  await user.update({
    reset_token: resetToken,
    reset_token_expiry: resetTokenExpiry,
  })

  await sendResetEmail(email, resetToken, role)

  return { message: 'Password reset email sent' }
}

const resetPassword = async (role, token, newPassword) => {
  let Model
  if (role === 'buyer') Model = Buyer
  else if (role === 'agent') Model = Agent
  else if (role === 'admin') Model = Admin
  else throw new Error('Invalid role')

  const user = await Model.findOne({ where: { reset_token: token } })
  if (!user) throw new Error('Invalid or expired reset token')

  if (new Date() > user.reset_token_expiry) {
    throw new Error('Reset token has expired')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await user.update({
    password: hashedPassword,
    reset_token: null,
    reset_token_expiry: null,
  })

  return { message: 'Password reset successful' }
}

module.exports = { register, login, forgotPassword, resetPassword }