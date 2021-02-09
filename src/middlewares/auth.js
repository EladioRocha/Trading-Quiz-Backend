'use strict'

/**
 * @file auth.js Middleware to manage the auth.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Middleware to manage the auth. For example functions with JWT.
 * @module middlewares/auth
 * @requires path
 * @requires helpers/handleResponse
 * @requires services/userService
 * @param {express.Request} req - Object for request api.
 * @param {express.Response} res - Object for response api.
 * @param {express.Next} next - Callback to pass to next function.
 */

const path = require('path'),
  { response } = require(path.join(__dirname, '..', 'helpers', 'handleResponse')),
  userService = require(path.join(__dirname, '..', 'services', 'userService'))

module.exports = {
  isAuth
}

function isAuth(req, res, next) {
  try {
    const token = req.headers.Authorization || req.headers.authorization
    if(!token) {
      return res.status(401).json({
        ...response(401, 'Access denied. No token has been received'),
        data: null
      })
    } 

    const userToken = userService.isValidToken(token)

    if(!userToken) {
      return res.status(400).json({
        ...response(400, 'The token has expired, please login again'),
        data: null
      })
    }

    res.locals.user = userToken

    next()
  } catch (error) {
    console.error(`An error occurred while verifying user authentication --> ${error.toString()}`)
  }
}