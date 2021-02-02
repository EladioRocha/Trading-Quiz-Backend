'use strict'

/**
 * @file password.js Is file helper to manage password hash.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Password hashing module.
 * @module helpers/password
 * @requires bcrypt
 */

const bcrypt = require('bcrypt')

module.exports = {
  hashString,
  compareHashString
}

/**
 * Convert plain text to hash.
 * @param {String} plainText - The string to hash.
 * @returns {String} - Generated hash.
 */
function hashString(plainText) {
  try {
    return bcrypt.hashSync(plainText, parseInt(process.env.BCRYPT_SALT_ROUNDS))
  } catch (error) {
    console.error(`An error occurred while creating the hash --> ${error.toString()}`)
  }
}

/**
 * Compare if the receiven plain text is the same with the previous hash.
 * @param {String} plainText - Plain text received on server.
 * @param {String} hash - The hash generated previously.
 * @return {Boolean} - Is correct hash or not.
 */
function compareHashString(plainText, hash) {
  try {
    return bcrypt.compareSync(plainText, hash)
  } catch (error) {
    console.error(`An error occurred when comparing hashes --> ${error.toString()}`)
  }
}