'use strict'

/**
 * @file users.js Middleware to manage the data from user.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Middleware to manage the data from user.
 * @module middlewares/users
 * @requires path
 * @requires helpers/handleResponse
 * @requires helpers/sanitizerString
 * @requires services/userService
 * @param {express.Request} req - Object for request api.
 * @param {express.Response} res - Object for response api.
 * @param {express.Next} next - Callback to pass to next function.
 */

const path = require('path'),
  { response } = require(path.join(__dirname, '..', 'helpers', 'handleResponse')),
  sanitizer = require(path.join(__dirname, '..', 'helpers', 'sanitizerString')),
  userService = require(path.join(__dirname, '..', 'services', 'userService')),
  { compareHashString } = require(path.join(__dirname, '..', 'helpers', 'password'))

module.exports = {
  verifyNewUserData,
  verifyLoginFields,
  validPasswordProfileFields,
  isValidPassword,
  isValidEmail,
  isValidUsername
}

async function verifyNewUserData(req, res, next) {
  try {
    const { username, email, password } = sanitizer.sanitizeAllValluesInObjHTML(sanitizer.trimAllValuesInObj(req.body))

    if (!sanitizer.isValidLenString(username, 2, 20)) {
      return res.status(400).json({
        ...response(400, 'Username has invalid length. 2 - 20'),
        data: null
      })
    }
    if (!sanitizer.isValidLenString(email, 6, 100)) {
      return res.status(400).json({
        ...response(400, 'The email has an invalid length. 6 - 50'),
        data: null
      })
    }
    if (!sanitizer.isValidLenString(password, 6, 100)) {
      return res.status(400).json({
        ...response(400, 'The password has an invalid length. 6 - 100'),
        data: null
      })
    }
    if (username.indexOf(' ') >= 0) {
      return res.status(400).json({
        ...response(400, 'Username cannot contain spaces'),
        data: null
      })
    }
    if (email.indexOf(' ') >= 0) {
      return res.status(400).json({
        ...response(400, 'The email cannot contain spaces'),
        data: null
      })
    }
    if (await existUserInDb(email)) {
      return res.status(400).json({
        ...response(400, 'The email has already been registered previously'),
        data: null
      })
    }
    if (await existUserInDb(username)) {
      return res.status(400).json({
        ...response(400, 'Username has already been registered previously'),
        data: null
      })
    }
    res.locals.user = {
      username,
      email,
      password
    }

    next()
  } catch (error) {
    console.error(`An error occurred while verifying the information of the new user --> ${error.toString()}`)
  }
}

async function existUserInDb(user) {
  try {
    return await userService.getUser(user)
  } catch (error) {
    console.error(`An error has occurred when verifying the existence of the mail in our database --> ${error.toString()}`)
  }
}

async function verifyLoginFields(req, res, next) {
  try {
    const { user, password } = sanitizer.sanitizeAllValluesInObjHTML(sanitizer.trimAllValuesInObj(req.body))

    if (!sanitizer.isValidLenString(user, 2, 100) ||
      user.indexOf(' ') >= 0 ||
      !sanitizer.isValidLenString(password, 6, 100)) {
      return res.status(400).json({
        ...response(400, 'Username or password is invalid'),
        data: null
      })
    }

    res.locals.user = {
      user,
      password
    }

    next()
  } catch (error) {
    console.error(`An error occurred while verifying the user's login information --> ${error.toString()}`)
  }
}

async function validPasswordProfileFields(req, res, next) {
  try {
    const { password, newPassword } = sanitizer.sanitizeAllValluesInObjHTML(sanitizer.trimAllValuesInObj(req.body))
    if (!sanitizer.isValidLenString(password, 6, 100)) {
      return res.status(400).json({
        ...response(400, 'The current password is invalid'),
        data: null
      })
    }
    if (!sanitizer.isValidLenString(newPassword, 6, 100)) {
      return res.status(400).json({
        ...response(400, 'The password has an invalid length. 6 - 100'),
        data: null
      })
    }
    if (password === newPassword) {
      return res.status(400).json({
        ...response(400, 'Passwords cannot be the same'),
        data: null
      })
    }

    res.locals.user.password = password
    res.locals.user.newPassword = newPassword

    next()
  } catch (error) {
    console.error(`An error occurred while verifying the user's password --> ${error.toString()}`)
  }
}

async function isValidPassword(req, res, next) {
  try {
    const { password, email, user } = res.locals.user,
      hashPassword = await userService.getHashPasswordUser(email || user),
      validPassword = compareHashString(password, hashPassword)

    if(!hashPassword) {
      return res.status(400).json({
        ...response(400, 'Invalid username or password'),
        data: null
      })
    }
    if (!validPassword) {
      return res.status(400).json({
        ...response(400, 'Invalid current password field'),
        data: null
      })
    }

    next()
  } catch (error) {
    console.error(`An error occurred while validating the user's password --> ${error.toString()}`)
  }
}

async function isValidEmail(req, res, next) {
  try {
    const { email } = res.locals.user,
      { newEmail } = sanitizer.sanitizeAllValluesInObjHTML(sanitizer.trimAllValuesInObj(req.body))

    if (email === newEmail) {
      return res.status(400).json({
        ...response(400, 'The mail cannot be the same'),
        data: null
      })
    }
    if (!sanitizer.isValidLenString(newEmail, 6, 50)) {
      return res.status(400).json({
        ...response(400, 'The email has an invalid length. 6 - 50'),
        data: null
      })
    }
    if (newEmail.indexOf(' ') >= 0) {
      return res.status(400).json({
        ...response(400, 'The email cannot contain spaces'),
        data: null
      })
    }
    if (await existUserInDb(newEmail)) {
      return res.status(400).json({
        ...response(400, 'The email has already been registered previously'),
        data: null
      })
    }

    res.locals.user.newEmail = newEmail
    next()
  } catch (error) {
    console.error(`An error occurred when validating the user's email --> ${error.toString()}`)
  }
}

async function isValidUsername(req, res, next) {
  try {
    const { username } = res.locals.user,
      { newUsername } = sanitizer.sanitizeAllValluesInObjHTML(sanitizer.trimAllValuesInObj(req.body))

    if (username === newUsername) {
      return res.status(400).json({
        ...response(400, 'Username cannot be the same'),
        data: null
      })
    }
    if (!sanitizer.isValidLenString(newUsername, 2, 20)) {
      return res.status(400).json({
        ...response(400, 'Username has invalid length. 2 - 20'),
        data: null
      })
    }
    if (newUsername.indexOf(' ') >= 0) {
      return res.status(400).json({
        ...response(400, 'Username cannot contain spaces'),
        data: null
      })
    }
    if (await existUserInDb(newUsername)) {
      return res.status(400).json({
        ...response(400, 'Username has already been registered previously'),
        data: null
      })
    }

    res.locals.user.newUsername = newUsername
    next()
  } catch (error) {
    console.error(`An error occurred when validating the user's email --> ${error.toString()}`)
  }
}