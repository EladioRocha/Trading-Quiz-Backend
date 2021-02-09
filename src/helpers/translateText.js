'use strict'

/**
 * @file translateText.js Receive the text and translate to selected language by user. Now is not useful in API because is too slow.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Receive the status number and return the answer depending of status.
 * @module helpers/translateText
 * @requires translatte
 * @requires mongoose
 */

const translatte = require('translatte'),
  mongoose = require('mongoose'),
  fs = require('fs')

/**
 * transform all text to selected language by user.
 * @param {[Object]} data - The data with all iformation to translate.
 * @param {String} iso - The standard from language to translate.
 * @returns {[Object]} - Return object data with translation.
 */
async function translate(data, iso) {
  try {
    for(const object of data) {
      for(const key in object) {
        const value = object[key]
        if(typeof value === 'object' && !mongoose.Types.ObjectId.isValid(value)) {
          await translate([value], iso) // has one t
        }
        if(typeof value === 'string' && key === 'en') {
          const { text } = await translatte(value, {to: 'es'})
          console.log(text)
          object['es'] = text
          console.log(object)
          return data
          // object[key] = {
          //   en: value,
          //   es: ''
          // } // has double t
        }
      }
    }
    return data
  } catch (error) {
    console.error(`An error has occurred in translation text --> ${JSON.stringify(error)}`)
  }
}

module.exports = {
  translate
}