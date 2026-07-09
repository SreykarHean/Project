const { Report, Buyer, Listing, Admin } = require('../models')
const notificationService = require('./notificationService')

const createReport = async (buyerId, data) => {
  return await Report.create({ ...data, buyer_id: buyerId })
}

const getAllReports = async () => {
  return await Report.findAll({
    include: [
      { model: Buyer, attributes: ['full_name', 'email'] },
      { model: Listing, attributes: ['title', 'city'] },
      { model: Admin, attributes: ['full_name'] },
    ],
    order: [['createdAt', 'DESC']],
  })
}

const STATUS_MESSAGES = {
  reviewed: (listingTitle) => `Your report on "${listingTitle}" is being reviewed by our team.`,
  resolved: (listingTitle) => `Your report on "${listingTitle}" has been resolved. Thanks for helping keep listings trustworthy.`,
}

const AGENT_MESSAGE = (listingTitle, reason) =>
  `Your listing "${listingTitle}" was reported and reviewed by an admin. Reason: ${reason}`

// notifyAgent is an explicit admin choice, not automatic on every status change
const updateReportStatus = async (id, adminId, status, notifyAgent = false) => {
  const report = await Report.findByPk(id, { include: [{ model: Listing }] })
  if (!report) throw new Error('Report not found')

  await report.update({ status, admin_id: adminId })

  const listingTitle = report.Listing?.title || 'a listing'

  // Always let the buyer know their report was acted on
  const buyerMessageFn = STATUS_MESSAGES[status]
  if (buyerMessageFn) {
    await notificationService.createNotification({
      buyerId: report.buyer_id,
      type: 'report_update',
      message: buyerMessageFn(listingTitle),
      link: `/buyer/listings/${report.listing_id}`,
    })
  }

  // Only notify the agent if the admin explicitly opted in
  if (notifyAgent && report.Listing?.agent_id) {
    await notificationService.createNotification({
      agentId: report.Listing.agent_id,
      type: 'report_flagged',
      message: AGENT_MESSAGE(listingTitle, report.reason),
      link: `/agent/listings/${report.listing_id}`,
    })
  }

  return report
}

const getReportsForListing = async (agentId, listingId) => {
  const listing = await Listing.findByPk(listingId)
  if (!listing) throw new Error('Listing not found')
  if (listing.agent_id !== Number(agentId)) throw new Error('You can only view reports on your own listings')

  // buyer identity is withheld from the agent to prevent retaliation against reporters;
  // admin still sees the full picture via getAllReports
  return await Report.findAll({
    where: { listing_id: listingId },
    attributes: ['report_id', 'report_type', 'status', 'reason', 'agent_response', 'createdAt'],
    order: [['createdAt', 'DESC']],
  })
}

const respondToReport = async (agentId, reportId, response) => {
  const report = await Report.findByPk(reportId, { include: [{ model: Listing }] })
  if (!report) throw new Error('Report not found')
  if (report.Listing?.agent_id !== agentId) throw new Error('You can only respond to reports on your own listings')

  await report.update({ agent_response: response })
  return report
}

module.exports = { createReport, getAllReports, updateReportStatus, getReportsForListing, respondToReport }