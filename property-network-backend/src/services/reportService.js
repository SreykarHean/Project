const { Report, Buyer, Listing, Admin } = require('../models')

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

const updateReportStatus = async (id, adminId, status) => {
  const report = await Report.findByPk(id)
  if (!report) throw new Error('Report not found')
  await report.update({ status, admin_id: adminId })
  return report
}

module.exports = { createReport, getAllReports, updateReportStatus }