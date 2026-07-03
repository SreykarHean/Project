const { QaQuestion, QaAnswer, Buyer, Agent, Listing } = require('../models')
const notificationService = require('./notificationService')

const createQuestion = async (buyerId, data) => {
  const question = await QaQuestion.create({
    ...data,
    buyer_id: buyerId,
  })
  return question
}

const getQuestionsByListing = async (listingId) => {
  const questions = await QaQuestion.findAll({
    where: { listing_id: listingId },
    include: [
      {
        model: Buyer,
        attributes: ['full_name'],
      },
      {
        model: QaAnswer,
        include: [
          { model: Agent, attributes: ['full_name', 'agency_name'] }
        ],
      },
    ],
  })
  return questions
}

const createAnswer = async (agentId, questionId, data) => {
  const answer = await QaAnswer.create({
    ...data,
    agent_id: agentId,
    question_id: questionId,
  })

  // notify the buyer who asked, so they see it on their Notifications page
  const question = await QaQuestion.findByPk(questionId, {
    include: [{ model: Listing, attributes: ['listing_id', 'title'] }],
  })

  if (question) {
    const agent = await Agent.findByPk(agentId, { attributes: ['full_name'] })
    await notificationService.createNotification({
      buyerId: question.buyer_id,
      type: 'qa_reply',
      message: `${agent?.full_name || 'An agent'} replied to your question on "${question.Listing?.title || 'a listing'}"`,
      link: `/buyer/listings/${question.listing_id}`,
    })
  }

  return answer
}

const markHelpful = async (answerId) => {
  const answer = await QaAnswer.findByPk(answerId)
  if (!answer) throw new Error('Answer not found')
  await answer.update({ is_helpful: true })
}

module.exports = { createQuestion, getQuestionsByListing, createAnswer, markHelpful }
