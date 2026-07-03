const express = require('express')
const router = express.Router()
const {
  getProfile, updateProfile, uploadProfilePhoto, deleteProfilePhoto,
  getSavedListings, saveListing, unsaveListing,
  getNotifications, markNotificationRead, markAllNotificationsRead,
  getConversations, getConversationMessages, getMessageableAgents, sendMessage,
  saveComparison, getComparisons,
} = require('../controllers/buyerController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')
const { profilePhotoUpload } = require('../middleware/uploadMiddleware')

router.use(protect)
router.use(allowRoles('buyer'))

router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.post('/profile/photo', (req, res, next) => {
  profilePhotoUpload.single('photo')(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message })
    next()
  })
}, uploadProfilePhoto)
router.delete('/profile/photo', deleteProfilePhoto)

router.get('/saved', getSavedListings)
router.post('/saved/:listing_id', saveListing)
router.delete('/saved/:listing_id', unsaveListing)

router.get('/notifications', getNotifications)
router.patch('/notifications/read-all', markAllNotificationsRead)
router.patch('/notifications/:notif_id', markNotificationRead)

// GET /buyers/messages              -> conversation list (one row per agent)
// GET /buyers/messages/contacts     -> agents available to start a NEW chat with
// GET /buyers/messages/:agent_id    -> full thread with that agent
// POST /buyers/messages             -> send a text or location message
router.get('/messages', getConversations)
router.get('/messages/contacts', getMessageableAgents)
router.get('/messages/:agent_id', getConversationMessages)
router.post('/messages', sendMessage)

router.get('/comparisons', getComparisons)
router.post('/comparisons', saveComparison)

module.exports = router
