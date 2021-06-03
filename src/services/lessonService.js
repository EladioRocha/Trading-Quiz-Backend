'use strict'

/**
 * @file lessonService.js The logic of the lessons like list all lessons or get one quiz etc.
 * @author Eladio Rocha Vizcaino
 */

/**
 * The logic of the lessons like list all lessons or get one quiz etc.
 * @module services/lessonService
 * @requires mongoose
 * @requires path
 * @requires models/Lessons
 */


const mongoose = require('mongoose'),
  path = require('path'),
  Lesson = require(path.join(__dirname, '..', 'models', 'Lessons'))

module.exports = {
  getMetadataLessons,
  getLesson,
  markAsRead,
  getNextLesson,
  userReadLesson
}

/**
 * Get all lessons availables in our app
 * @param {String} type - The type of lessons for example, forex, stock, etc.
 * @returns {Array<Object>} - Return the metadata of lessons.
 */
async function getMetadataLessons(type) {
  try {
    console.log("El tipo: ", type)
    const lessons = await Lesson.find({ 'type.en': type })
      .select('_id title description content coins order')
      .sort({ order: 'asc' })
      .lean()

    return lessons
  } catch (error) {
    console.error(`An error occurred while getting lesson information from the service --> ${error.toString()}`)
  }
}

/**
 * Get specific lesson by lessonId.
 * @param {String} lessonId - _id from specific lesson.
 * @returns {Object} - Return the specific lesson
 */
async function getLesson(lessonId) {
  try {
    lessonId = mongoose.Types.ObjectId(lessonId)
    const lessons = await Lesson.findOne({ _id: lessonId }).select('_id title content type order')
    return lessons
  } catch (error) {
    console.error(`An error occurred while getting the lesson information --> ${lessonId} in service --> ${error.toString()}`)
  }
}

/**
 * Get the _id from the next lesson.
 * @param {String} type - Type of lesson (Forex, Bitcoin, etc.).
 * @param {Number} order - The order of lesson.
 * @returns {String|Null} - Return null object if not exist other lesson otherwise return string _id.
 */
async function getNextLesson(type, order) {
  try {
    const lesson = await Lesson.findOne({
      'type.en': type,
      order: (order + 1)
    })
    return (!lesson) ? null : lesson._id
  } catch (error) {
    console.error(`An error occurred getting the _id of the next lesson in the service --> ${error.toString()}`)
  }
}

/**
 * Update lecture when user finish reading.
 * @param {String} userId - _id from specific user.
 * @param {String} lessonId - _id from specific lecture.
 * @returns {Number} - Return the number of coins earned.
 */
async function markAsRead(userId, lessonId) {
  try {
    userId = mongoose.Types.ObjectId(userId)
    lessonId = mongoose.Types.ObjectId(lessonId)

    const read = await userReadLesson(userId, lessonId)

    if (read >= 1) {
      return 0
    }

    const { coins } = await Lesson.findOne({ _id: lessonId }).select('coins')
    Promise.all([
      Lesson.updateOne(
        { _id: lessonId },
        {
          $addToSet: {
            usersId: [{ userId }]
          }
        }
      ),
      mongoose.model('User').updateOne(
        {
          _id: userId
        },
        {
          $inc: { coins }
        }
      )
    ])

    return coins
  } catch (error) {
    console.error(`An error occurred while marking the reading as read in the service --> ${userId}--> ${lessonId} --> ${error.toString()}`)
  }
}

async function userReadLesson(userId, lessonId) {
  try {
    userId = mongoose.Types.ObjectId(userId)
    lessonId = mongoose.Types.ObjectId(lessonId)
    const result = await Lesson.count({
      _id: lessonId,
      usersId: {
        $elemMatch: {
          userId
        }
      }
    })

    return result
  } catch (error) {
    console.error(`An error occurred while obtaining the status of the readings read by the user in the service --> ${error.toString()}`)
  }
}