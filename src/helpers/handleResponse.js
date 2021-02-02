'use strict'

/**
 * @file handleResponse.js Receive the status number and return the answer depending of status.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Receive the status number and return the answer depending of status.
 * @module helpers/handleResponse
 * @requires path
 * @requires config/responses.json
 */

const path = require('path'),
  responses = require(path.join(__dirname, '..', 'config', 'responses.json'));

/**
 * Send response depending status.
 * @param {Number} status - Status number of request user.
 * @param {String} message - Personalized message from send to user.
 * @returns {{ success: Number, statusText: String, message: String }} - Return object with metadata setted. 
 */
function response(status, message = null) {
  try {
    return {
      success: responses[status].success,
      statusText: responses[status].text,
      message: (!message) ? responses[status].message : message
    }
  } catch (error) {
    console.error(`An error has occurred in the response handler --> ${error.toString()}`)
  }
}

module.exports = {
  response
}