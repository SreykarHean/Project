const reportService = require('../services/reportService')

const createReport = async (req, res, next) => {
  try {
    const report = await reportService.createReport(req.user.id, req.body)
    res.status(201).json({ success: true, message: 'Report submitted', data: report })
  } catch (err) { next(err) }
}

const getAllReports = async (req, res, next) => {
  try {
    const reports = await reportService.getAllReports()
    res.json({ success: true, data: reports })
  } catch (err) { next(err) }
}

const updateReportStatus = async (req, res, next) => {
  try {
    const report = await reportService.updateReportStatus(req.params.id, req.user.id, req.body.status)
    res.json({ success: true, message: 'Report updated', data: report })
  } catch (err) { next(err) }
}

module.exports = { createReport, getAllReports, updateReportStatus }