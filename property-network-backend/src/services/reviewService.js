const { Review, Buyer, Agent } = require('../models')
const notificationService = require('./notificationService')

const createReview = async (buyerId, data) => {
  const review = await Review.create({
    ...data,
    buyer_id: buyerId,
  })

  const stars = '★'.repeat(review.rating)
  await notificationService.createNotification({
    agentId: review.agent_id,
    type: 'new_review',
    message: `You received a new ${stars} review`,
    link: `/agent/profile`,
  })

  return review
}

const getReviewsForAgent = async (agentId) => {
  const reviews = await Review.findAll({
    where: { agent_id: agentId },
    include: [{ model: Buyer, attributes: ['full_name'] }],
    order: [['createdAt', 'DESC']],
  })
  return reviews
}

const deleteReview = async (reviewId, buyerId) => {
  const review = await Review.findByPk(reviewId)
  if (!review) throw new Error('Review not found')
  if (review.buyer_id !== buyerId) throw new Error('Unauthorized')
  await review.destroy()
}

module.exports = {
  createReview,
  getReviewsForAgent,
  deleteReview,
}