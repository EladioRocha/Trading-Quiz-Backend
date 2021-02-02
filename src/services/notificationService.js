'use strict'

/**
 * @file notificationService.js The logic of notifications.
 * @author Eladio Rocha Vizcaino
 */

/**
 * The logic of notifications.
 * @module services/notificationService
 * @requires mongoose
 * @requires path
 * @requires models/Notifications
 */

const mongoose = require('mongoose'),
  path = require('path'),
  Notification = require(path.join(__dirname, '..', 'models', 'Notifications'))

module.exports = {
  getUnviewed,
  markAsRead
}

/**
 * Get all unviewed notifications by user
 * @param {String} userId - _id user
 * @returns {Object} Return all notifications not viewed by user. 
 */
async function getUnviewed(userId) {
  try {
    userId = mongoose.Types.ObjectId(userId)
    const notifications = await Notification.find({
      usersId: {
        $not: {
          $elemMatch: {
            userId,
          }
        }
      },
      createdAt: { $gte: userId.getTimestamp() }
    })

    return notifications
  } catch (error) {
    console.error(`An error occurred while getting the unviewed notifications --> ${error.toString()}`)
  }
}

/**
 * Mark unviewed notifications like viewed.
 * @param {String} userId - _id user
 */
async function markAsRead(userId) {
  try {
    userId = mongoose.Types.ObjectId(userId)
    await Notification.update(
      {
        usersId: {
          $not: {
            $elemMatch: {
              userId,
            }
          }
        },
        createdAt: { $gte: userId.getTimestamp() }
      },
      {
        $addToSet: {
          usersId: [{ userId, read: true }]
        }
      },
      {
        multi: true
      }
    )
  } catch (error) {
    console.error(`An error occurred in the service when marking the notifications as read --> ${error.toString()}`)
  }
}