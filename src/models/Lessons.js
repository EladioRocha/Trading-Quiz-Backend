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
 * @todo - Add fields en, es, etc in title, description, etc.
 */
const LessonSchema = new mongoose.Schema(
  {
    /**
     * The text that appears on the card.
     */
    title: { type: String, required: true, minlength: 1, maxlength: 300 },
    /**
     * Extract of main content.
     */
    description: { type: String, default: '', minlength: 0, maxlength: 500 },
    /**
     * Content of the current lesson
     */
    content: { type: String, required: true, minlength: 1, maxlength: 5000 },
    /**
     * Amount of coins earned by take the lesson.
     */
    coins: { type: Number, required: true, default: 50 },
    /**
     * The type of quiz, for example Forex, Stock, Cryptocurrency, etc.
     */
    type: { type: String, required: true },
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