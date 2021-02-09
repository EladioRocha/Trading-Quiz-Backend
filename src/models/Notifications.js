'use strict'

/**
 * @file Notifications.js Notifications model mongoose.
 * @author Eladio Rocha Vizcaino
 */

/**
 * @requires mongoose
 */
const mongoose = require('mongoose')

/**
 * Notifications
 */

/**
 * @todo - Refactor field language to [{iso: es}, {iso: en}]
 */
const NotificationSchema = new mongoose.Schema(
  {
    /**
     * The text that appear on notification
     */
    title: {
      en: { type: String, required: true, minlength: 1, maxlength: 300 },
      es: { type: String, required: false, minlength: 1, maxlength: 300 }
    },
    description: {
      en: { type: String, required: false, minlength: 1, maxlength: 300 },
      es: { type: String, required: false, minlength: 1, maxlength: 300 }
    },
    type: {
      type: String,
      enum: ['REWARD', 'FEATURE'],
      required: true
    },
    image: { type: String, required: true, default: 'default.png' },
    usersId: [{
      userId: { type: mongoose.Types.ObjectId, required: true },
      createdAt: { type: Date, required: true, default: new Date }
    }]
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

module.exports = mongoose.model('Notification', NotificationSchema)