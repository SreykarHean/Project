const express = require('express')
const router = express.Router()
const { createQuestion, getQuestionsByListing, createAnswer, markHelpful, deleteQuestion, deleteAnswer } = require('../controllers/qaController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')

router.get('/listing/:listing_id', getQuestionsByListing)
router.post('/', protect, allowRoles('buyer'), createQuestion)
router.delete('/:question_id', protect, allowRoles('buyer'), deleteQuestion)
router.post('/:question_id/answers', protect, allowRoles('agent'), createAnswer)
router.delete('/answers/:answer_id', protect, allowRoles('agent'), deleteAnswer)
router.patch('/answers/:answer_id/helpful', protect, allowRoles('buyer'), markHelpful)

module.exports = router