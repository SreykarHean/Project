const appointmentService = require('../services/appointmentService')

const createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.createAppointment(req.user.id, req.body)
    res.status(201).json({ success: true, message: 'Appointment booked', data: appointment })
  } catch (err) { next(err) }
}

const getBuyerAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getBuyerAppointments(req.user.id)
    res.json({ success: true, data: appointments })
  } catch (err) { next(err) }
}

const getAgentAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getAgentAppointments(req.user.id)
    res.json({ success: true, data: appointments })
  } catch (err) { next(err) }
}

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, req.body.status)
    res.json({ success: true, message: 'Appointment updated', data: appointment })
  } catch (err) { next(err) }
}

const cancelAppointment = async (req, res, next) => {
  try {
    await appointmentService.cancelAppointment(req.params.id, req.user.id)
    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (err) { next(err) }
}

module.exports = { createAppointment, getBuyerAppointments, getAgentAppointments, updateAppointmentStatus, cancelAppointment }