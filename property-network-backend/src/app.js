const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./routes/authRoutes')
const listingRoutes = require('./routes/listingRoutes')
const buyerRoutes = require('./routes/buyerRoutes')
const agentRoutes = require('./routes/agentRoutes')
const adminRoutes = require('./routes/adminRoutes')
const qaRoutes = require('./routes/qaRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const reportRoutes = require('./routes/reportRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const errorHandler = require('./middleware/errorHandler')

app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/buyers', buyerRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/qa', qaRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api', uploadRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Property Network API is running' })
})

app.use(errorHandler)

module.exports = app