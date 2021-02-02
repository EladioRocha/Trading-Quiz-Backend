'use strict'

/**
 * @file users.js Controllers of users requests.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Controller of user requests. All methods receive the following params
 * @module controllers/users
 * @requires path
 * @requires helpers/handleResponse
 * @requires helpers/password
 * @requires services/userService
 * @param {express.Request} req - Object for request api.
 * @param {express.Response} res - Object for response api.
 * @returns {Object} - Return status with state and data.
 */

const path = require('path'),
  { response } = require(path.join(__dirname, '..', 'helpers', 'handleResponse')),
  { hashString } = require(path.join(__dirname, '..', 'helpers', 'password')),
  userService = require(path.join(__dirname, '..', 'services', 'userService'))


module.exports = {
  create,
  login,
  resetPassword,
  updateEmail,
  updateUsername,
  updateStatusNotifications
}

function create(req, res) {
  try {
    const { password } = res.locals.user
    res.locals.user.password = hashString(password)
    userService.create(res.locals.user)

    res.status(200).json({
      ...response(200, 'Registered user successfully'),
      data: null
    })
  } catch (error) {
    console.error(`An error occurred while creating the user in the controller --> ${error.toString()}`)
  }
}

async function login(req, res) {
  try {
    const { user } = res.locals.user,
      result = await userService.getUser(user)

    if (!result) {
      return res.status(400).json({
        ...response(400, 'Invalid username or password'),
        data: null
      })
    }
    const token = userService.generateToken(result)

    res.status(200).json({
      ...response(200, 'Successful login. You will be redirected to the main page'),
      data: {
        coins: result.coins,
        username: result.username,
        email: result.email,
        token
      }
    })
  } catch (error) {
    console.error(`An error occurred while creating the user in the controller --> ${error.toString()}`)
  }
}

async function resetPassword(req, res) {
  try {
    const { _id, newPassword } = res.locals.user
    await userService.updatePassword(_id, hashString(newPassword))
    res.status(200).json({
      ...response(200, 'Your password has been updated successfully'),
      data: null
    })
  } catch (error) {
    console.error(`An error occurred while resetting the user password on the controller --> ${error.toString()}`)
  }
}

async function updateEmail(req, res) {
  try {
    const { _id, newEmail } = res.locals.user,
      result = await userService.updateEmail(_id, newEmail),
      token = userService.generateToken(result)

    res.status(200).json({
      ...response(200, 'Your email has been updated successfully'),
      data: {
        email: result.email,
        token
      }
    })
  } catch (error) {
    console.error(`An error occurred while updating the email in the controller --> ${error.toString()}`)
  }
}

async function updateUsername(req, res) {
  try {
    const { _id, newUsername } = res.locals.user,
      result = await userService.updateUsername(_id, newUsername),
      token = userService.generateToken(result)

    res.status(200).json({
      ...response(200, 'Your username has been updated successfully'),
      data: {
        username: result.username,
        token
      }
    })
  } catch (error) {
    console.error(`An error occurred while updating the username in the controller --> ${error.toString()}`)
  }
}

async function updateStatusNotifications(req, res) {
  try {
    const { _id } = res.locals.user,
      { allow } = req.body

    await userService.updateStatusNotifications(_id, allow)
    res.status(200).json({
      ...response(200, 'The status of the notifications has been updated successfully'),
      data: null
    })
  } catch (error) {
    console.error(`An error occurred while updating the status of the notifications in the controller --> ${error.toString()}`)
  }
}