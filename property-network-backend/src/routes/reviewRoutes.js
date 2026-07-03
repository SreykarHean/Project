const express = require('express')
const router = express.Router()
const { createReview, getReviewsForAgent, deleteReview } = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')

router.get('/agent/:agentId', getReviewsForAgent)
router.post('/', protect, allowRoles('buyer'), createReview)
router.delete('/:id', protect, allowRoles('buyer'), deleteReview)

module.exports = router
