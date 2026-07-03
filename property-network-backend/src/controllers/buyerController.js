const buyerService = require('../services/buyerService')

const getProfile = async (req, res, next) => {
  try {
    const buyer = await buyerService.getProfile(req.user.id)
    res.json({ success: true, data: buyer })
  } catch (err) { next(err) }
}

const updateProfile = async (req, res, next) => {
  try {
    const buyer = await buyerService.updateProfile(req.user.id, req.body)
    res.json({ success: true, message: 'Profile updated', data: buyer })
  } catch (err) { next(err) }
}

const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No photo uploaded' })
    }
    const photoUrl = req.file.secure_url || req.file.path
    const buyer = await buyerService.uploadProfilePhoto(req.user.id, photoUrl)
    res.json({ success: true, message: 'Profile photo updated', data: buyer })
  } catch (err) { next(err) }
}

const deleteProfilePhoto = async (req, res, next) => {
  try {
    const buyer = await buyerService.deleteProfilePhoto(req.user.id)
    res.json({ success: true, message: 'Profile photo removed', data: buyer })
  } catch (err) { next(err) }
}

const getSavedListings = async (req, res, next) => {
  try {
    const listings = await buyerService.getSavedListings(req.user.id)
    res.json({ success: true, data: listings })
  } catch (err) { next(err) }
}

const saveListing = async (req, res, next) => {
  try {
    await buyerService.saveListing(req.user.id, req.params.listing_id)
    res.status(201).json({ success: true, message: 'Listing saved' })
  } catch (err) { next(err) }
}

const unsaveListing = async (req, res, next) => {
  try {
    await buyerService.unsaveListing(req.user.id, req.params.listing_id)
    res.json({ success: true, message: 'Listing removed from saved' })
  } catch (err) { next(err) }
}

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await buyerService.getNotifications(req.user.id)
    res.json({ success: true, data: notifications })
  } catch (err) { next(err) }
}

const markNotificationRead = async (req, res, next) => {
  try {
    await buyerService.markNotificationRead(req.user.id, req.params.notif_id)
    res.json({ success: true, message: 'Notification marked as read' })
  } catch (err) { next(err) }
}

const markAllNotificationsRead = async (req, res, next) => {
  try {
    await buyerService.markAllNotificationsRead(req.user.id)
    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (err) { next(err) }
}

const getConversations = async (req, res, next) => {
  try {
    const conversations = await buyerService.getConversations(req.user.id)
    res.json({ success: true, data: conversations })
  } catch (err) { next(err) }
}

const getMessageableAgents = async (req, res, next) => {
  try {
    const agents = await buyerService.getMessageableAgents(req.user.id)
    res.json({ success: true, data: agents })
  } catch (err) { next(err) }
}

const getConversationMessages = async (req, res, next) => {
  try {
    const thread = await buyerService.getConversationMessages(req.user.id, req.params.agent_id)
    res.json({ success: true, data: thread })
  } catch (err) { next(err) }
}

const sendMessage = async (req, res, next) => {
  try {
    const message = await buyerService.sendMessage(req.user.id, req.body)
    res.status(201).json({ success: true, message: 'Message sent', data: message })
  } catch (err) { next(err) }
}

const saveComparison = async (req, res, next) => {
  try {
    const comparison = await buyerService.saveComparison(req.user.id, req.body.listing_ids)
    res.status(201).json({ success: true, message: 'Comparison saved', data: comparison })
  } catch (err) { next(err) }
}

const getComparisons = async (req, res, next) => {
  try {
    const comparisons = await buyerService.getComparisons(req.user.id)
    res.json({ success: true, data: comparisons })
  } catch (err) { next(err) }
}

module.exports = {
  getProfile, updateProfile, uploadProfilePhoto, deleteProfilePhoto,
  getSavedListings, saveListing, unsaveListing,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  getConversations, getConversationMessages, getMessageableAgents, sendMessage,
  saveComparison, getComparisons,
}
