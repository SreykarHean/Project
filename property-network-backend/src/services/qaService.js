const { QaQuestion, QaAnswer, Buyer, Agent, Listing } = require('../models')
const notificationService = require('./notificationService')

const createQuestion = async (buyerId, data) => {
  const question = await QaQuestion.create({
    ...data,
    buyer_id: buyerId,
  })

  // notify the listing's agent that a new question came in
  const listing = await Listing.findByPk(question.listing_id, {
    attributes: ['listing_id', 'title', 'agent_id'],
  })

  if (listing?.agent_id) {
    const askerLabel = question.is_anonymous
      ? 'Someone'
      : (await Buyer.findByPk(buyerId, { attributes: ['full_name'] }))?.full_name || 'A buyer'

    await notificationService.createNotification({
      agentId: listing.agent_id,
      type: 'qa_question',
      message: `${askerLabel} asked a question on "${listing.title}"`,
      link: `/agent/listings/${listing.listing_id}`,
    })
  }

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

const deleteQuestion = async (buyerId, questionId) => {
  const question = await QaQuestion.findByPk(questionId)
  if (!question) throw new Error('Question not found')
  if (question.buyer_id !== buyerId) throw new Error('You can only delete your own question')

  // remove any answers first so a deleted question doesn't leave orphaned answers
  await QaAnswer.destroy({ where: { question_id: questionId } })
  await question.destroy()
}

const deleteAnswer = async (agentId, answerId) => {
  const answer = await QaAnswer.findByPk(answerId)
  if (!answer) throw new Error('Answer not found')
  if (answer.agent_id !== agentId) throw new Error('You can only delete your own answer')
  await answer.destroy()
}

module.exports = { createQuestion, getQuestionsByListing, createAnswer, markHelpful, deleteQuestion, deleteAnswer }