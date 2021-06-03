'use strict'

/**
 * @file quizService.js The logic of the quizzes like list all quizzes or get one quiz etc.
 * @author Eladio Rocha Vizcaino
 */

/**
 * The logic of the quizzes like list all quizzes or get one quiz etc.
 * @module services/quizService
 * @requires mongoose
 * @requires path
 * @requires models/Quizzes
 */


const mongoose = require('mongoose'),
  path = require('path'),
  Quiz = require(path.join(__dirname, '..', 'models', 'Quizzes'))

module.exports = {
  getQuestionsQuiz,
  verifyAnswer,
  getMetadataQuizzes,
  recordAnswersUserQuiz
}

/**
 * Get the question of selected quiz.
 * @param {String} quizId - The objectId of selected quiz.
 * @returns {Object|Null} - Return the result, if quiz not exist in database return null object.
 */
async function getQuestionsQuiz(quizId, iso) {
  try {
    quizId = mongoose.Types.ObjectId(quizId)
    const $project = {
      _id: 1,
    }
    $project[`title.en`] = 1
    $project[`questions.answers.answer.en`] = 1
    $project[`questions.question.en`] = 1
    $project[`questions._id`] = 1
    $project[`questions.answers._id`] = 1

    const result = await Quiz.aggregate([
      {
        $match: {
          _id: quizId
        }
      },
      {
        $project
      }
    ])
    return result
  } catch (error) {
    console.error(`An error occurred while getting the quiz from the service --> ${error.toString()}`)
  }
}

/**
 * Verify if the answer send by user is correct.
 * @param {String} answerId - The objectId in string format of selected answer.
 * @returns {Boolean} - Return true or false depending if answer is correct or not.
 */
async function verifyAnswer(answerId) {
  try {
    answerId = mongoose.Types.ObjectId(answerId)

    const [result] = await Quiz.aggregate([
      {
        $match: {
          'questions.answers': {
            $elemMatch: {
              _id: answerId,
              isCorrect: true
            }
          }
        }
      },
      {
        $unwind: {
          path: '$questions'
        }
      },
      {
        $project: {
          _id: 1,
          questions: {
            $map: {
              input: {
                $filter: {
                  input: '$questions.answers',
                  as: 'answer',
                  cond: { $eq: ['$$answer.isCorrect', true] }
                }
              },
              as: 'question',
              in: {
                isCorrect: '$$question.isCorrect'
              }
            },
          }
        }
      },
      {
        $unwind: {
          path: '$questions'
        }
      },
    ])

    return (!result) ? false : result.questions.isCorrect
  } catch (error) {
    console.error(`An error occurred while checking the user's response in the service --> ${error.toString()}`)
  }
}

/**
 * Save the result of user in specific quiz.
 * @param {String} userId - ObjectId in string format of user.
 * @param {String} quizId - ObjectId in string format of quiz.
 * @param {Array<Object>} answers - Array of object where the keys are: questionId and answerId.
 * @returns {String} - Return the amount of coins depending the number of correct answers from user.
 */
async function recordAnswersUserQuiz(userId, quizId, answers) {
  try {
    userId = mongoose.Types.ObjectId(userId)
    quizId = mongoose.Types.ObjectId(quizId)
    answers = answers.map(answer => ({
      questionId: mongoose.Types.ObjectId(answer.questionId),
      answerId: mongoose.Types.ObjectId(answer.answerId)
    }))

    const result = await Quiz.findOneAndUpdate(
      { _id: quizId },
      {
        $push: {
          usersId: [{
            userId,
            answers
          }]
        }
      }
    )
      .select('_id coins questions')
      .lean(),
      sizeQuestions = result.questions.length


    delete result.questions
    answers = answers.map(answer => verifyAnswer(answer.answerId))
    answers = await Promise.all(answers)
    answers = answers.reduce((count, answer) => count += (answer === true) ? 1 : 0)

    if (answers > sizeQuestions) {
      answers = sizeQuestions
    }

    const earnedCoins = (result.coins * (answers / sizeQuestions)).toFixed(2)

    // Update the user coins.
    await mongoose.model('User').updateOne(
      {
        _id: userId
      },
      {
        $inc: { coins: earnedCoins }
      }
    )

    return earnedCoins
  } catch (error) {
    console.error(`An error occurred while saving the user's score in the service --> ${error.toString()}`)
  }
}

/**
 * Get all quizzes availables in our app
 * @param {String} type - The type of quizzes for example, forex, stock, etc.
 * @returns {Array<Object>} - Return the metadata of quizzes.
 */
async function getMetadataQuizzes(type, iso) {
  try {
    const query = {}
    query['type.en'] = type
    console.log(query)
    const quizzes = await Quiz.find(query)
      .select(`_id title.en description.en coins`)
      .lean()

    return quizzes
  } catch (error) {
    console.error(`An error has occurred when obtaining the information of the quizzes in the service --> ${error.toString()}`)
  }
}