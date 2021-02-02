'use strict'

/**
 * @file notifications.js User notifications
 * @author Eladio Rocha Vizcaino
 */

/**
 * Controller of notification requests. All methods receive the following params
 * @module controllers/notifications
 * @requires path
 * @requires helpers/handleResponse
 * @requires services/notificationService
 * @param {express.Request} req - Object for request api.
 * @param {express.Response} res - Object for response api.
 * @returns {Object} - Return status with state and data.
 */

const path = require('path'),
  { response } = require(path.join(__dirname, '..', 'helpers', 'handleResponse')),
  notificationService = require(path.join(__dirname, '..', 'services', 'notificationService'))

module.exports = {
  getUnviewed,
  markAsRead
}

async function getUnviewed(req, res) {
  try {
    const { _id } = res.locals.user,
      notifications = await notificationService.getUnviewed(_id)

    res.status(200).json({
      ...response(200),
      data: { notifications }
    })
  } catch (error) {
    console.error(`An error occurred while getting the unseen notifications in the controller --> ${error.toString()}`)
  }
}

async function markAsRead(req, res) {
  try {
    const { _id } = res.locals.user
    await notificationService.markAsRead(_id)
    res.status(200).json({
      ...response(200),
      data: null
    })
  } catch (error) {
    console.error(`An error occurred while marking the notifications as read in the controller --> ${error.toString()}`)
  }
}