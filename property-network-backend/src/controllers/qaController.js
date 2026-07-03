const qaService = require('../services/qaService')

const createQuestion = async (req, res, next) => {
  try {
    const question = await qaService.createQuestion(req.user.id, req.body)
    res.status(201).json({ success: true, message: 'Question posted', data: question })
  } catch (err) {
    next(err)
  }
}

const getQuestionsByListing = async (req, res, next) => {
  try {
    const questions = await qaService.getQuestionsByListing(req.params.listing_id)
    res.json({ success: true, data: questions })
  } catch (err) {
    next(err)
  }
}

const createAnswer = async (req, res, next) => {
  try {
    const answer = await qaService.createAnswer(req.user.id, req.params.question_id, req.body)
    res.status(201).json({ success: true, message: 'Answer posted', data: answer })
  } catch (err) {
    next(err)
  }
}

const markHelpful = async (req, res, next) => {
  try {
    await qaService.markHelpful(req.params.answer_id)
    res.json({ success: true, message: 'Marked as helpful' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createQuestion, getQuestionsByListing, createAnswer, markHelpful }