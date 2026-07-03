const reviewService = require('../services/reviewService')

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body)
    res.status(201).json({ success: true, message: 'Review submitted', data: review })
  } catch (err) {
    next(err)
  }
}

const getReviewsForAgent = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsForAgent(req.params.agentId)
    res.json({ success: true, data: reviews })
  } catch (err) {
    next(err)
  }
}

const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id, req.user.id)
    res.json({ success: true, message: 'Review deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createReview,
  getReviewsForAgent,
  deleteReview,
}
