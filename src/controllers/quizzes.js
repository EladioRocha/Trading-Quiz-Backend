'use strict'

/**
 * @file quizzes.js Controllers of quizzes requests.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Controller of quizzes requests. All methods receive the following params
 * @module controllers/users
 * @requires path
 * @requires helpers/handleResponse
 * @requires services/quizService
 * @param {express.Request} req - Object for request api.
 * @param {express.Response} res - Object for response api.
 * @returns {Object} - Return status with state and data.
 */

const path = require('path'),
  { response } = require(path.join(__dirname, '..', 'helpers', 'handleResponse')),
  quizService = require(path.join(__dirname, '..', 'services', 'quizService'))


module.exports = {
  getQuestions,
  verifyAnswer,
  getMetadataQuizzes,
  saveRecordUserQuizz,
}

async function getQuestions(req, res) {
  try {
    const { quizId } = req.params,
      { iso } = req.headers,
      quiz = await quizService.getQuestionsQuiz(quizId, iso)
  
    res.status(200).json({
      ...response(200),
      data: { quiz }
    })
  } catch (error) {
    console.error(`An error occurred while getting the quiz in the controller --> ${error.toString()}`)
  }
}

async function verifyAnswer(req, res) {
  try {
    const { answerId } = req.params,
      isCorrectAnswer = await quizService.verifyAnswer(answerId)

    res.status(200).json({
      ...response(200),
      data: { isCorrectAnswer }
    })
  } catch (error) {
    console.error(`An error occurred while checking the user response in the controller --> ${error.toString()}`)
  }
}

async function getMetadataQuizzes(req, res) {
  try {
    const { type } = req.params,
      { iso } = req.headers,
      quizzes = await quizService.getMetadataQuizzes(type, iso)
      
    res.status(200).json({
      ...response(200),
      data: { quizzes }
    })
  } catch (error) {
    console.error(`An error occurred while getting user information in the controller --> ${error.toString()}`)
  }
}

async function saveRecordUserQuizz(req, res) {
  try {
    const { _id } = res.locals.user,
      { quizId, answers } = req.body

    const coins = await quizService.recordAnswersUserQuiz(_id, quizId, answers)
    res.status(200).json({
      ...response(200, `You have finished the quiz. You earned ${coins} coins.`),
      data: { coins }
    })
  } catch (error) {
    console.error(`An error occurred while saving user output to controller --> ${error.toString()}`)
  }
}