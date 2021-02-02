'use strict'

/**
 * @file userService.js The logic of the users like interact with database, generateToken, etc.
 * @author Eladio Rocha Vizcaino
 */

/**
 * The logic of the users like interact with database, generateToken, etc.
 * @module services/userService
 * @requires mongoose
 * @requires path
 * @requires jsonwebtoken
 * @requires models/Users
 */


const mongoose = require('mongoose'),
  path = require('path'),
  jwt = require('jsonwebtoken'),
  User = require(path.join(__dirname, '..', 'models', 'Users'))

module.exports = {
  create,
  getUser,
  generateToken,
  isValidToken,
  getHashPasswordUser,
  updatePassword,
  updateEmail,
  updateUsername,
  updateStatusNotifications
}

/**
 * Create the user and save in database.
 * @param {{username: String, email: String, password: String}} user - The data from user.
 * @returns {Object} - Return the result after saving it to the database.
 */
async function create(user) {
  try {
    const result = await User.create({
      ...user
    })

    return result
  } catch (error) {
    console.error(`An error occurred while creating the user in the service --> ${error.toString()}`)
  }
}

/**
 * Get user by username or email.
 * @param {String} user - This param can be username or email, the function search by the two options.
 * @returns {Object|Null} - Return the result, if user not exist in database return null object.
 */
async function getUser(user) {
  try {
    const result = await User.findOne({
      $or: [
        { username: user },
        { email: user }
      ]
    })

    return result
  } catch (error) {
    console.error(`An error occurred while getting a user in the service --> ${error.toString()}`)
  }
}

/**
 * Generate the token when user login
 * @param {String} username
 * @param {String} email
 * @returns {String} - Return generated token.
 */
function generateToken({ _id, username, email }) {
  try {
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 86400, // One day.
      context: {
        _id,
        username,
        email
      }
    }, process.env.JWT_SECRET_KEY)
  } catch (error) {
    console.error(`An error occurred while generating the token in the service --> ${error.toString()}`)
  }
}

/**
 * Verify if received token is valid.
 * @param {String} token - User token.
 * @returns {Object|Null} - Return object with info user or null if token is invalid or expired.
 */
function isValidToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY, (error, result) => {
      if (error || !result) {
        return null
      }

      return result.context
    })
  } catch (error) {
    console.error(`An error occurred while validating the token in the service --> ${error.toString()}`)
  }
}

/**
 * Get password by username or email.
 * @param {String} user - This param can be username or email
 * @returns {String|Null} - Return password has or null value if user doesn´t exist.
 */
async function getHashPasswordUser(user) {
  try {
    const result = await User.findOne({
      $or: [
        { username: user },
        { email: user }
      ]
    }).select('_id password')

    if (!result) {
      return null
    }

    return result.password
  } catch (error) {
    console.error(`An error occurred while obtaining the user's password in the service --> ${error.toString()}`)
  }
}

/**
 * Update password user.
 * @param {String} userId - _id from user in db. 
 * @param {String} password - Password from user hashed. 
 */
async function updatePassword(userId, password) {
  try {
    userId = mongoose.Types.ObjectId(userId)
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          password
        }
      }
    )
  } catch (error) {
    console.error(`An error occurred while updating the user's password in the service --> ${error.toString()}`)
  }
}

/**
 * Update email user.
 * @param {String} userId - _id from user in db. 
 * @param {String} email - Email from user. 
 */
async function updateEmail(userId, email) {
  try {
    userId = mongoose.Types.ObjectId(userId)
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          email
        }
      },
      { new: true }
    ).select('_id username email')

    return user
  } catch (error) {
    console.error(`An error occurred while updating the user's mail in the service --> ${error.toString()}`)
  }
}

/**
 * Update username.
 * @param {String} userId - _id from user in db. 
 * @param {String} username - New username from user. 
 */
async function updateUsername(userId, username) {
  try {
    userId = mongoose.Types.ObjectId(userId)
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          username
        }
      },
      { new: true }
    )

    return user
  } catch (error) {
    console.error(`An error occurred while updating the username in the service --> ${error.toString()}`)
  }
}

/**
 * Update status mobile push notifications from specific user.
 * @param {String} userId - _id from user.
 * @param {Boolean} allow - Allow or disallow notifications.
 */
async function updateStatusNotifications(userId, allow) {
  try {
    userId = mongoose.Types.ObjectId(userId)
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          activeNotifications: allow
        }
      }
    )
  } catch (error) {
    console.error(`An error occurred while updating the username in the service --> ${error.toString()}`)
  }
}