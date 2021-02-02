'use strict'

/**
 * @file Quizzes.js Quizzes model mongoose.
 * @author Eladio Rocha Vizcaino
 */

/**
 * @requires mongoose
 */
const mongoose = require('mongoose')

/**
 * Quizzes
 */

/**
 * @todo - Add fields en, es, etc in title, description, etc.
 * @todo - Refactor field language to [{iso: es}, {iso: en}]
 */
const QuizSchema = new mongoose.Schema(
  {
    /**
     * The text that appears on the card.
     */
    title: { type: String, required: true, minlength: 1, maxlength: 300 },
    /**
     * Description of the current quiz
     */
    description: { type: String, required: true, minlength: 1, maxlength: 300 },
    /**
     * Store all questions from one quiz with corresponding possibles answers.
     */
    questions: [{
      /**
       * The question of quiz in different language.
       */
      question: {
        en: { type: String, required: true, minlength: 1, maxlength: 300 },
        es: { type: String, required: false, minlength: 1, maxlength: 300 }
      },
      /**
       * Array of possible answer from current question.
       */
      answers: [{
        /**
         * The possible answer in different language.
         */
        answer: {
          en: { type: String, required: true, minlength: 1, maxlength: 300 },
          es: { type: String, required: false, minlength: 1, maxlength: 300 }
        },
        /**
         * Is correct answer or not.
         */
        isCorrect: { type: Boolean, required: true, default: false },
        /**
         * The explanation why the answer is correct or not.
         */
        explanation: { type: String, required: false, default: '', maxlength: 500 }
      }]
    }],
    /**
     * Amount of coins earned by solve the quiz.
     */
    coins: { type: Number, required: true, default: 50 },
    /**
     * The type of quiz, for example Forex, Stock, Cryptocurrency, etc.
     */
    type: { type: String, required: true },
    /**
     * User who have played a quiz.
     */
    usersId: [{
      userId: { type: mongoose.Types.ObjectId, required: true },
      answers: [{
        questionId: { type: mongoose.Types.ObjectId, required: true },
        answerId: { type: mongoose.Types.ObjectId, required: true }
      }],
      createdAt: { type: Date, required: true, default: Date.now, immutable: true }
    }],
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

module.exports = mongoose.model('Quiz', QuizSchema)