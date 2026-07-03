const express = require('express')
const router = express.Router()
const { createQuestion, getQuestionsByListing, createAnswer, markHelpful } = require('../controllers/qaController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')

router.get('/listing/:listing_id', getQuestionsByListing)
router.post('/', protect, allowRoles('buyer'), createQuestion)
router.post('/:question_id/answers', protect, allowRoles('agent'), createAnswer)
router.patch('/answers/:answer_id/helpful', protect, allowRoles('buyer'), markHelpful)

module.exports = router