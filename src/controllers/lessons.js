'use strict'

/**
 * @file lessons.js Controllers of lessons requests.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Controller of lessons requests. All methods receive the following params
 * @module controllers/users
 * @requires path
 * @requires helpers/handleResponse
 * @requires services/lessonService
 * @param {express.Request} req - Object for request api.
 * @param {express.Response} res - Object for response api.
 * @returns {Object} - Return status with state and data.
 */

const path = require('path'),
  { readingTime } = require('reading-time-estimator'),
  { response } = require(path.join(__dirname, '..', 'helpers', 'handleResponse')),
  lessonService = require(path.join(__dirname, '..', 'services', 'lessonService'))


module.exports = {
  getMetadataLessons,
  getLesson,
  markAsRead
}

async function getMetadataLessons(req, res) {
  try {
    const { type } = req.params,
      { _id } = res.locals.user,
      lessons = await lessonService.getMetadataLessons(type)

    for(const lesson of lessons) {
      const result = await lessonService.userReadLesson(_id, lesson._id)
      lesson.readingTime = readingTime(lesson.content.en, 160).text
      lesson.statusRead = (result >= 1) ? true : false
      delete lesson.content

    }

    res.status(200).json({
      ...response(200),
      data: { lessons }
    })
  } catch (error) {
    console.error(`An error occurred while getting the lesson information in the controller --> ${error.toString()}`)
  }
}

async function getLesson(req, res) {
  try {
    const { lessonId } = req.params,
      lesson = await lessonService.getLesson(lessonId),
      nextLessonId = await lessonService.getNextLesson(lesson.type.en, lesson.order)

    res.status(200).json({
      ...response(200),
      data: { lesson, nextLessonId }
    })
  } catch (error) {
    console.error(`An error occurred while getting the lesson information in the controller --> ${error.toString()}`)
  }
}

async function markAsRead(req, res) {
  try {
    const { _id } = res.locals.user,
      { lessonId } = req.body
      
    const coins = await lessonService.markAsRead(_id, lessonId)
    res.status(200).json({
      ...response(200, `The reading has been marked as read, you have received +${coins}`),
      data: null
    })
  } catch (error) {
    console.error(`An error occurred while marking the reading as read from the controller --> ${error.toString()}`)
  }
}