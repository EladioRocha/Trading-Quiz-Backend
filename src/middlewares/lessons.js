'use strict'

/**
 * @file lessons.js Middleware to manage lessons.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Middleware to manage the data from lesson.
 * @module middlewares/users
 * @requires path
 * @requires helpers/handleResponse
 * @param {express.Request} req - Object for request api.
 * @param {express.Response} res - Object for response api.
 * @param {express.Next} next - Callback to pass to next function.
 */

const path = require('path'),
  mongoose = require('mongoose'),
  { response } = require(path.join(__dirname, '..', 'helpers', 'handleResponse'))

module.exports = {
  isValidLesson
}

async function isValidLesson(req, res, next) {
  try {
    const { lessonId } = req.params
    if (!lessonId || !mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({
        ...response(400, `The lessonId ${(lessonId)} parameter is invalid`),
        data: null
      })
    }
    next()
  } catch (error) {
    console.error(`An error has occurred when verifying the existence of the mail in our database --> ${error.toString()}`)
  }
}