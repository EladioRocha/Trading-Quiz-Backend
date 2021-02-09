'use strict'

/**
 * @file Lessons.js Lessons model mongoose.
 * @author Eladio Rocha Vizcaino
 */

/**
 * @requires mongoose
 */
const mongoose = require('mongoose')

/**
 * Lessons
 */

/**
 * @todo - Refactor field language to [{iso: es}, {iso: en}]
 */
const LessonSchema = new mongoose.Schema(
  {
    /**
     * The text that appears on the card.
     */
    title: {
      en: { type: String, required: true, minlength: 1, maxlength: 300 },
      es: { type: String, required: false, minlength: 1, maxlength: 300 }
    },
    /**
     * Extract of main content.
     */
    description: {
      en: { type: String, required: true, minlength: 1, maxlength: 500 },
      es: { type: String, required: false, minlength: 1, maxlength: 500 }
    },
    /**
     * Content of the current lesson
     */
    content: {
      en: { type: String, required: true, minlength: 1, maxlength: 5000 },
      es: { type: String, required: false, minlength: 1, maxlength: 5000 }
    },
    /**
     * Amount of coins earned by take the lesson.
     */
    coins: { type: Number, required: true, default: 50 },
    /**
     * The type of quiz, for example Forex, Stock, Cryptocurrency, etc.
     */
    type: {
      en: { type: String, required: true, minlength: 1, maxlength: 100 },
      es: { type: String, required: false, minlength: 1, maxlength: 100 }
    },
    /**
     * The ascending order to order lessons.
     */
    order: { type: Number, required: true },
    /**
     * User who have take a lesson.
     */
    usersId: [{
      userId: { type: mongoose.Types.ObjectId, required: true },
      createdAt: { type: Date, required: true, default: Date.now, immutable: true }
    }],
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

module.exports = mongoose.model('Lesson', LessonSchema)