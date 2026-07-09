const jwt = require('jsonwebtoken')
const { Buyer } = require('../models')

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // catches buyers banned *after* their token was issued, since JWTs
    // stay valid on their own until they expire
    if (decoded.role === 'buyer') {
      const buyer = await Buyer.findByPk(decoded.id, { attributes: ['status'] })
      if (!buyer || buyer.status === 'banned') {
        return res.status(403).json({ message: `Your account has been suspended. Contact us at ${process.env.EMAIL_USER} for assistance.` })
      }
    }

    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = { protect }