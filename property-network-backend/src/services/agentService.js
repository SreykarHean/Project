const { Agent, Listing, Review, Buyer, Notification, Message } = require('../models')
const messageService = require('./messageService')

/* -------------------------
   PROFILE
------------------------- */

const getAgentProfile = async (agentId) => {
  const agent = await Agent.findByPk(agentId, {
    attributes: { exclude: ['password'] },
  })

  if (!agent) throw new Error('Agent not found')
  return agent
}

const updateAgentProfile = async (agentId, data) => {
  const agent = await Agent.findByPk(agentId)
  if (!agent) throw new Error('Agent not found')

  delete data.password
  delete data.email
  delete data.agent_id

  await agent.update(data)
  return agent
}

const uploadProfilePhoto = async (agentId, photoUrl) => {
  const agent = await Agent.findByPk(agentId)
  if (!agent) throw new Error('Agent not found')
  await agent.update({ profile_photo: photoUrl })
  agent.password = undefined
  return agent
}

const deleteProfilePhoto = async (agentId) => {
  const agent = await Agent.findByPk(agentId)
  if (!agent) throw new Error('Agent not found')
  await agent.update({ profile_photo: null })
  agent.password = undefined
  return agent
}

/* -------------------------
   REVIEWS
------------------------- */

const getAgentReviews = async (agentId) => {
  return await Review.findAll({
    where: { agent_id: agentId },
    include: [{ model: Buyer, attributes: ['full_name'] }],
    order: [['createdAt', 'DESC']],
  })
}

/* -------------------------
   LISTINGS
------------------------- */

const getAgentListings = async (agentId) => {
  return await Listing.findAll({
    where: { agent_id: agentId },
    include: [{ model: Agent, attributes: ['full_name', 'agency_name'] }],
  })
}

/* -------------------------
   NOTIFICATIONS
------------------------- */

const getNotifications = async (agentId) => {
  return await Notification.findAll({
    where: { agent_id: agentId },
    order: [['createdAt', 'DESC']],
  })
}

const markNotificationRead = async (agentId, notifId) => {
  const notif = await Notification.findOne({
    where: { notif_id: notifId, agent_id: agentId },
  })

  if (!notif) throw new Error('Notification not found')

  await notif.update({ is_read: true })
  return notif
}

const markAllNotificationsRead = async (agentId) => {
  await Notification.update(
    { is_read: true },
    { where: { agent_id: agentId, is_read: false } }
  )
}

/* -------------------------
   MESSAGES (CORE FIXED LOGIC)
------------------------- */

/**
 * Returns grouped conversations for sidebar
 */
const getConversations = async (agentId) => {
  const messages = await Message.findAll({
    where: { agent_id: agentId },
    include: [{ model: Buyer, attributes: ['buyer_id', 'full_name'] }],
    order: [['sent_at', 'DESC']],
  })

  const map = new Map()

  for (const msg of messages) {
    const buyerId = msg.buyer_id
    const buyerName = msg.Buyer?.full_name || 'Unknown'

    if (!map.has(buyerId)) {
      map.set(buyerId, {
        buyer_id: buyerId,
        buyer_name: buyerName,
        last_message:
          msg.message_type === 'location'
            ? '📍 Shared a location'
            : msg.body || '',
        last_message_at: msg.sent_at,
        unread_count: 0,
      })
    }

    if (msg.sender_type === 'buyer' && !msg.is_read) {
      map.get(buyerId).unread_count += 1
    }
  }

  return Array.from(map.values())
}

/**
 * Returns full chat thread
 */
const getConversationMessages = async (agentId, buyerId) => {
  const buyer = await Buyer.findByPk(buyerId, {
    attributes: ['buyer_id', 'full_name'],
  })

  if (!buyer) throw new Error('Buyer not found')

  const messages = await Message.findAll({
    where: {
      agent_id: agentId,
      buyer_id: buyerId,
    },
    order: [['sent_at', 'ASC']],
  })

  // mark buyer messages as read
  await Message.update(
    { is_read: true },
    {
      where: {
        agent_id: agentId,
        buyer_id: buyerId,
        sender_type: 'buyer',
        is_read: false,
      },
    }
  )

  return {
    buyer,
    messages,
  }
}

/**
 * Send message (agent → buyer)
 */
const sendMessage = async (agentId, data) => {
  const {
    buyer_id,
    body,
    message_type,
    location_lat,
    location_lng,
    location_label,
  } = data

  if (!buyer_id) throw new Error('buyer_id is required')

  const type = message_type === 'location' ? 'location' : 'text'

  if (type === 'location') {
    if (location_lat == null || location_lng == null) {
      throw new Error('Location coordinates required')
    }
  } else {
    if (!body || !body.trim()) {
      throw new Error('Message cannot be empty')
    }
  }

  return await messageService.createMessage({
    buyerId: buyer_id,
    agentId,
    senderType: 'agent',
    body,
    messageType: type,
    location: {
      lat: location_lat,
      lng: location_lng,
      label: location_label,
    },
  })
}

/* -------------------------
   EXPORTS
------------------------- */

module.exports = {
  getAgentProfile,
  updateAgentProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  getAgentReviews,
  getAgentListings,

  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,

  getConversations,
  getConversationMessages,
  sendMessage,
}