const express = require('express')
const router = express.Router()
const {
  getAgentProfile, updateAgentProfile, uploadProfilePhoto, deleteProfilePhoto,
  getAgentReviews, getAgentListings,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  getConversations, getConversationMessages, sendMessage,
} = require('../controllers/agentController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')
const { profilePhotoUpload } = require('../middleware/uploadMiddleware')

router.use(protect)
router.use(allowRoles('agent'))

router.get('/profile', getAgentProfile)
router.put('/profile', updateAgentProfile)
router.post('/profile/photo', (req, res, next) => {
  profilePhotoUpload.single('photo')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message })
    next()
  })
}, uploadProfilePhoto)
router.delete('/profile/photo', deleteProfilePhoto)
router.get('/reviews', getAgentReviews)
router.get('/listings', getAgentListings)

router.get('/notifications', getNotifications)
router.patch('/notifications/read-all', markAllNotificationsRead)
router.patch('/notifications/:notif_id', markNotificationRead)

// GET /agents/messages          -> conversation list (one row per buyer)
// GET /agents/messages/:buyer_id -> full thread with that buyer
// POST /agents/messages         -> send a text or location message
router.get('/messages', getConversations)
router.get('/messages/:buyer_id', getConversationMessages)
router.post('/messages', sendMessage)

module.exports = router