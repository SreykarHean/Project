const { Message, Buyer, Agent } = require('../models')
const notificationService = require('./notificationService')

// Generic conversation message creator used by both buyer and agent sides.
// senderType tells us which side is sending, so we know who to notify.
const createMessage = async ({
  buyerId,
  agentId,
  senderType,
  body,
  messageType = 'text',
  location,
}) => {

  // 🚨 HARD BLOCK EMPTY TEXT
  if (messageType === 'text') {
    if (!body || typeof body !== 'string' || !body.trim()) {
      throw new Error('Message body cannot be empty')
    }
  }

  const payload = {
    buyer_id: buyerId,
    agent_id: agentId,
    sender_type: senderType,
    message_type: messageType,
    body: messageType === 'text' ? body.trim() : null,
  }

  if (messageType === 'location') {
    payload.location_lat = location?.lat ?? null
    payload.location_lng = location?.lng ?? null
    payload.location_label = location?.label ?? null
  }

  const message = await Message.create(payload)

  // Notify whichever side did NOT send this message.
  if (senderType === 'agent') {
    const agent = await Agent.findByPk(agentId, { attributes: ['full_name'] })
    const preview = messageType === 'location'
      ? 'shared a location with you'
      : (body?.length > 60 ? `${body.slice(0, 60)}...` : body)

    await notificationService.createNotification({
      buyerId,
      type: 'message',
      message: `New message from ${agent?.full_name || 'your agent'}: ${preview}`,
      link: `/buyer/messages/${agentId}`,
    })
  } else {
    const buyer = await Buyer.findByPk(buyerId, { attributes: ['full_name'] })
    const preview = messageType === 'location'
      ? 'shared a location with you'
      : (body?.length > 60 ? `${body.slice(0, 60)}...` : body)

    await notificationService.createNotification({
      agentId,
      type: 'message',
      message: `New message from ${buyer?.full_name || 'a buyer'}: ${preview}`,
      link: `/agent/messages/${buyerId}`,
    })
  }

  return message
}

module.exports = { createMessage }