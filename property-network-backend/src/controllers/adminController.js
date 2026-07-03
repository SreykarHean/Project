const adminService = require('../services/adminService')

const getAllAgents = async (req, res, next) => {
  try {
    const agents = await adminService.getAllAgents()
    res.json({ success: true, data: agents })
  } catch (err) {
    next(err)
  }
}

const getAllBuyers = async (req, res, next) => {
  try {
    const buyers = await adminService.getAllBuyers()
    res.json({ success: true, data: buyers })
  } catch (err) {
    next(err)
  }
}

const verifyAgent = async (req, res, next) => {
  try {
    const agent = await adminService.verifyAgent(req.params.id)
    res.json({ success: true, message: 'Agent verified', data: agent })
  } catch (err) {
    next(err)
  }
}

const updateBuyerStatus = async (req, res, next) => {
  try {
    const buyer = await adminService.updateBuyerStatus(req.params.id, req.body.status)
    res.json({ success: true, message: `Buyer status updated to ${req.body.status}`, data: buyer })
  } catch (err) {
    next(err)
  }
}

const getAllReports = async (req, res, next) => {
  try {
    const reports = await adminService.getAllReports()
    res.json({ success: true, data: reports })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAllAgents,
  getAllBuyers,
  verifyAgent,
  updateBuyerStatus,
  getAllReports,
}
