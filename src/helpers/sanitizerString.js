'use strict'

/**
 * @file sanitizerString.js In this module process the strings and validate.
 * @author Eladio Rocha Vizcaino
 */

/**
 * In this module process the strings and validate.
 * @module helpers/sanitizerString
 * @requires sanitizerHtml
 */

const sanitizeHtml = require('sanitize-html')

module.exports = {
  sanitizeHtml,
  trimAllValuesInObj,
  isValidLenString,
  sanitizeAllValluesInObjHTML
}

/**
 * Verify if the size of string is valid with received parameters.
 * @param {String} str - String to validate.
 * @param {Number} minLen - Minimun size of string.
 * @param {Number} maxLen - Maximum size of string.
 * @returns {Boolean} - Is valid string or not.
 */
function isValidLenString(str, minLen = 0, maxLen = 100) {
  return (typeof str === 'string') ?
    str.length <= maxLen && str.length >= minLen
    :
    false
}

/**
 * Clean spaces inf left and right side of all values
 * @param {Object} data - Object with data of user.
 * @returns {Object} - Return the same object with cleaned values. 
 */
function trimAllValuesInObj(data) {
  try {
    Object.keys(data).forEach(key => data[key] = data[key].trim())
    return data
  } catch (error) {
    console.error(`An error occurred while trimming object values ​​for a new user --> ${error.toString()}`)
  }
}

/**
 * Clean HTML tags if they had
 * @param {Object} data - Object with values to clean.
 * @returns {Object} -  Return the same object with HTML tags cleaned.
 */
function sanitizeAllValluesInObjHTML(data) {
  try {
    Object.keys(data).forEach(key => data[key] = sanitizeHtml(data[key], {
      allowedTags: [],
      allowedAttributes: {}
    }))
    return data
  } catch (error) {
    console.error(`An error occurred while sanitizing the HTML values ​​data --> ${error.toString()}`)
  }
}