const { Notification } = require('../models')

// Creates a real notification row for a buyer or an agent.
// Pass exactly one of buyerId / agentId depending on the recipient.
// type examples: 'message', 'qa_reply', 'appointment'
const createNotification = async ({ buyerId = null, agentId = null, type, message, link = null }) => {
  return await Notification.create({
    buyer_id: buyerId,
    agent_id: agentId,
    type,
    message,
    link,
  })
}

module.exports = {
  createNotification,
}