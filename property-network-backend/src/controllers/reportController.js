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
    const report = await reportService.updateReportStatus(
      req.params.id,
      req.user.id,
      req.body.status,
      req.body.notifyAgent === true
    )
    res.json({ success: true, message: 'Report updated', data: report })
  } catch (err) { next(err) }
}

const getReportsForListing = async (req, res, next) => {
  try {
    const reports = await reportService.getReportsForListing(req.user.id, req.params.listing_id)
    res.json({ success: true, data: reports })
  } catch (err) { next(err) }
}

const respondToReport = async (req, res, next) => {
  try {
    const report = await reportService.respondToReport(req.user.id, req.params.id, req.body.response)
    res.json({ success: true, message: 'Response submitted', data: report })
  } catch (err) { next(err) }
}

module.exports = { createReport, getAllReports, updateReportStatus, getReportsForListing, respondToReport }