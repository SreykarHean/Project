const express = require('express')
const router = express.Router()
const { createAppointment, getBuyerAppointments, getAgentAppointments, updateAppointmentStatus, cancelAppointment } = require('../controllers/appointmentController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')

router.post('/', protect, allowRoles('buyer'), createAppointment)
router.get('/buyer', protect, allowRoles('buyer'), getBuyerAppointments)
router.get('/agent', protect, allowRoles('agent'), getAgentAppointments)
router.patch('/:id/status', protect, allowRoles('agent'), updateAppointmentStatus)
router.patch('/:id/cancel', protect, allowRoles('buyer'), cancelAppointment)

module.exports = router