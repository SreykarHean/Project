const { Admin, Agent, Buyer, Listing, Report } = require('../models')

const getAllAgents = async () => {
  return await Agent.findAll({ attributes: { exclude: ['password'] } })
}

const getAllBuyers = async () => {
  return await Buyer.findAll({ attributes: { exclude: ['password'] } })
}

const verifyAgent = async (agentId) => {
  const agent = await Agent.findByPk(agentId)
  if (!agent) throw new Error('Agent not found')
  agent.is_verified = true
  await agent.save()
  agent.password = undefined
  return agent
}

const updateBuyerStatus = async (buyerId, status) => {
  const buyer = await Buyer.findByPk(buyerId)
  if (!buyer) throw new Error('Buyer not found')
  buyer.status = status
  await buyer.save()
  buyer.password = undefined
  return buyer
}

const getAllReports = async () => {
  return await Report.findAll({
    include: [
      { model: Buyer, attributes: ['full_name', 'email'] },
      { model: Listing, attributes: ['title'] },
    ],
  })
}

module.exports = {
  getAllAgents,
  getAllBuyers,
  verifyAgent,
  updateBuyerStatus,
  getAllReports,
}
