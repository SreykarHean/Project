const { Buyer, SavedListing, Listing, Agent, ListingPhoto, Notification, Message, ListingComparison, Appointment } = require('../models')
const messageService = require('./messageService')

const getProfile = async (buyerId) => {
  const buyer = await Buyer.findByPk(buyerId, { attributes: { exclude: ['password'] } })
  if (!buyer) throw new Error('Buyer not found')
  return buyer
}

const updateProfile = async (buyerId, data) => {
  const buyer = await Buyer.findByPk(buyerId)
  if (!buyer) throw new Error('Buyer not found')
  delete data.password
  delete data.email
  delete data.buyer_id
  delete data.profile_photo // photo only changes via the upload/delete endpoints below
  await buyer.update(data)
  buyer.password = undefined
  return buyer
}

const uploadProfilePhoto = async (buyerId, photoUrl) => {
  const buyer = await Buyer.findByPk(buyerId)
  if (!buyer) throw new Error('Buyer not found')
  await buyer.update({ profile_photo: photoUrl })
  buyer.password = undefined
  return buyer
}

const deleteProfilePhoto = async (buyerId) => {
  const buyer = await Buyer.findByPk(buyerId)
  if (!buyer) throw new Error('Buyer not found')
  await buyer.update({ profile_photo: null })
  buyer.password = undefined
  return buyer
}

const getSavedListings = async (buyerId) => {
  return await SavedListing.findAll({
    where: { buyer_id: buyerId },
    include: [{
      model: Listing,
      include: [{ model: Agent, attributes: ['full_name', 'agency_name'] }, { model: ListingPhoto }],
    }],
  })
}

const saveListing = async (buyerId, listingId) => {
  const existing = await SavedListing.findOne({ where: { buyer_id: buyerId, listing_id: listingId } })
  if (existing) throw new Error('Listing already saved')
  return await SavedListing.create({ buyer_id: buyerId, listing_id: listingId })
}

const unsaveListing = async (buyerId, listingId) => {
  const saved = await SavedListing.findOne({ where: { buyer_id: buyerId, listing_id: listingId } })
  if (!saved) throw new Error('Saved listing not found')
  await saved.destroy()
}

const getNotifications = async (buyerId) => {
  return await Notification.findAll({
    where: { buyer_id: buyerId },
    order: [['createdAt', 'DESC']],
  })
}

const markNotificationRead = async (buyerId, notifId) => {
  const notif = await Notification.findOne({ where: { notif_id: notifId, buyer_id: buyerId } })
  if (!notif) throw new Error('Notification not found')
  await notif.update({ is_read: true })
  return notif
}

const markAllNotificationsRead = async (buyerId) => {
  await Notification.update(
    { is_read: true },
    { where: { buyer_id: buyerId, is_read: false } }
  )
}

// One row per agent the buyer has an active thread with, newest message first,
// with an unread count — this is what powers the conversation list in the UI.
const getConversations = async (buyerId) => {
  const messages = await Message.findAll({
    where: { buyer_id: buyerId },
    include: [{ model: Agent, attributes: ['agent_id', 'full_name', 'agency_name'] }],
    order: [['sent_at', 'DESC']],
  })

  const conversations = new Map()
  for (const msg of messages) {
    const agentId = msg.agent_id
    if (!conversations.has(agentId)) {
      conversations.set(agentId, {
        agent_id: agentId,
        agent_name: msg.Agent?.full_name || 'Agent',
        agency_name: msg.Agent?.agency_name || '',
        last_message: msg.message_type === 'location' ? '📍 Shared a location' : msg.body,
        last_message_at: msg.sent_at,
        last_sender: msg.sender_type,
        unread_count: 0,
      })
    }
    if (msg.sender_type === 'agent' && !msg.is_read) {
      conversations.get(agentId).unread_count += 1
    }
  }

  return Array.from(conversations.values())
}

// Agents the buyer can start a conversation with: anyone whose listing
// they've saved or booked an appointment for. Powers the "New Message"
// picker on the Messages page.
const getMessageableAgents = async (buyerId) => {
  const [saved, appts] = await Promise.all([
    SavedListing.findAll({
      where: { buyer_id: buyerId },
      include: [{
        model: Listing, attributes: ['listing_id', 'title'],
        include: [{ model: Agent, attributes: ['agent_id', 'full_name', 'agency_name'] }],
      }],
    }),
    Appointment.findAll({
      where: { buyer_id: buyerId },
      include: [{
        model: Listing, attributes: ['listing_id', 'title'],
        include: [{ model: Agent, attributes: ['agent_id', 'full_name', 'agency_name'] }],
      }],
    }),
  ])

  const map = new Map()
  const add = (listing) => {
    if (!listing?.Agent) return
    if (!map.has(listing.Agent.agent_id)) {
      map.set(listing.Agent.agent_id, {
        agent_id: listing.Agent.agent_id,
        agent_name: listing.Agent.full_name,
        agency_name: listing.Agent.agency_name,
        listing_title: listing.title,
      })
    }
  }
  saved.forEach(s => add(s.Listing))
  appts.forEach(a => add(a.Listing))

  return Array.from(map.values())
}

// Full thread with one agent. Marks the agent's messages as read as a side effect,
// same as opening a thread in any real chat app.
const getConversationMessages = async (buyerId, agentId) => {
  const agent = await Agent.findByPk(agentId, { attributes: ['agent_id', 'full_name', 'agency_name'] })
  if (!agent) throw new Error('Agent not found')

  const messages = await Message.findAll({
    where: { buyer_id: buyerId, agent_id: agentId },
    order: [['sent_at', 'ASC']],
  })

  await Message.update(
    { is_read: true },
    { where: { buyer_id: buyerId, agent_id: agentId, sender_type: 'agent', is_read: false } }
  )

  return { agent, messages }
}

const sendMessage = async (buyerId, data) => {
  const { agent_id, body, message_type, location_lat, location_lng, location_label } = data

  if (!agent_id) throw new Error('agent_id is required')

  const agent = await Agent.findByPk(agent_id)
  if (!agent) throw new Error('This agent could not be found')

  const messageType = message_type === 'location' ? 'location' : 'text'

  if (messageType === 'location') {
    if (location_lat == null || location_lng == null) {
      throw new Error('Location coordinates are required to share a location')
    }
  } else if (!body || !body.trim()) {
    throw new Error('Message cannot be empty')
  }

  return await messageService.createMessage({
    buyerId,
    agentId: agent_id,
    senderType: 'buyer',
    body,
    messageType,
    location: { lat: location_lat, lng: location_lng, label: location_label },
  })
}

const saveComparison = async (buyerId, listingIds) => {
  return await ListingComparison.create({ buyer_id: buyerId, listing_ids: listingIds })
}

const getComparisons = async (buyerId) => {
  return await ListingComparison.findAll({ where: { buyer_id: buyerId } })
}

module.exports = {
  getProfile, updateProfile, uploadProfilePhoto, deleteProfilePhoto,
  getSavedListings, saveListing, unsaveListing,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  getConversations, getConversationMessages, getMessageableAgents, sendMessage,
  saveComparison, getComparisons,
}
