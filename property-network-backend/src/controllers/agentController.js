const agentService = require('../services/agentService')

const getAgentProfile = async (req, res, next) => {
  try {
    const agent = await agentService.getAgentProfile(req.user.id)
    res.json({ success: true, data: agent })
  } catch (err) {
    next(err)
  }
}

const updateAgentProfile = async (req, res, next) => {
  try {
    const agent = await agentService.updateAgentProfile(req.user.id, req.body)
    res.json({ success: true, message: 'Profile updated', data: agent })
  } catch (err) {
    next(err)
  }
}

const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo uploaded' })
    }
    const photoUrl = req.file.secure_url || req.file.path
    const agent = await agentService.uploadProfilePhoto(req.user.id, photoUrl)
    res.json({ success: true, message: 'Profile photo updated', data: agent })
  } catch (err) { next(err) }
}

const deleteProfilePhoto = async (req, res, next) => {
  try {
    const agent = await agentService.deleteProfilePhoto(req.user.id)
    res.json({ success: true, message: 'Profile photo removed', data: agent })
  } catch (err) { next(err) }
}

const getAgentReviews = async (req, res, next) => {
  try {
    const reviews = await agentService.getAgentReviews(req.user.id)
    res.json({ success: true, data: reviews })
  } catch (err) {
    next(err)
  }
}

const getAgentListings = async (req, res, next) => {
  try {
    const listings = await agentService.getAgentListings(req.user.id)
    res.json({ success: true, data: listings })
  } catch (err) {
    next(err)
  }
}

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await agentService.getNotifications(req.user.id)
    res.json({ success: true, data: notifications })
  } catch (err) { next(err) }
}

const markNotificationRead = async (req, res, next) => {
  try {
    await agentService.markNotificationRead(req.user.id, req.params.notif_id)
    res.json({ success: true, message: 'Notification marked as read' })
  } catch (err) { next(err) }
}

const markAllNotificationsRead = async (req, res, next) => {
  try {
    await agentService.markAllNotificationsRead(req.user.id)
    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (err) { next(err) }
}

const getConversations = async (req, res, next) => {
  try {
    const conversations = await agentService.getConversations(req.user.id)
    res.json({ success: true, data: conversations })
  } catch (err) { next(err) }
}

const getConversationMessages = async (req, res, next) => {
  try {
    const thread = await agentService.getConversationMessages(req.user.id, req.params.buyer_id)
    res.json({ success: true, data: thread })
  } catch (err) { next(err) }
}

const sendMessage = async (req, res, next) => {
  try {
    const message = await agentService.sendMessage(req.user.id, req.body)
    res.status(201).json({ success: true, message: 'Message sent', data: message })
  } catch (err) { next(err) }
}

module.exports = {
  getAgentProfile,
  updateAgentProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  getAgentReviews,
  getAgentListings,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  getConversations, getConversationMessages, sendMessage,
}