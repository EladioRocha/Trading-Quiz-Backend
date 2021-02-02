'use strict'

/**
 * @file saveJsonQuizzesOnDb.js Help to save the json quizzes from data to db executing file and pass arguments. The arguments can be like following examples:
 * node saveJsonQuizzesOnDb <-- In this case all files of all directories are save into db.
 * node saveJsonQuizzesOnDb dir/file1.json dir/file2.json <-- In this case put one or more files to save. 
 * @author Eladio Rocha Vizcaino
 */

/**
 * @requires fs
 * @requires path
 * @requires glob
 * @requires mongoose
 * @requires models/Quizzes.js
 * @requires models/Lessons.js
 */

const fs = require('fs'),
  path = require('path'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  Quiz = require(path.join(__dirname, '..', 'models', 'Quizzes.js')),
  Lesson = require(path.join(__dirname, '..', 'models', 'Lessons.js'))

/**
 * @constant {String} quizzesDataDirectory - The path of all quizzes directory.
 */
const quizzesDataDirectory = path.join(__dirname, '..', 'data')

/**
 * Main function where get the arguments and call the handle function.
 */
async function main() {
  await mongoose.connect('mongodb://localhost:27017/tradingquiz')
  const selectedFiles = getSelectedFiles()
  await handleSelectedFiles(selectedFiles)
}

main()

/**
 * Handle from selected files depending received arguments.
 * @param {Array<String>} files - The full path of quizzes location. 
 */
async function handleSelectedFiles(files) {
  try {
    files = await getFileWithMatchFileName(files)
    files = getObjectQuizzesFromFilesDir(files)
    await saveQuizzes(files)
  } catch (error) {
    console.error(`An error has occurred in the selected file handler --> ${error.toString()}`)
  }
}

function getObjectQuizzesFromFilesDir(files) {
  return files.map(file => JSON.parse(fs.readFileSync(file)))
}

async function saveQuizzes(quizzes) {
  try {
    await Lesson.insertMany(quizzes, { ordered: false })
    console.log('The information has been saved successfully')
  } catch (error) {
    console.error(`An error has occurred when saving the quizzes in the database --> ${error.toString()}`)
  }
}

/**
 * List all matches with specified names in params.
 * @param {Array<String>} files - Search in all directories the match of all files if array is empty get all .json files
 * @returns {Array<String>} - Return all json files of every directory.
 */
function getFileWithMatchFileName(filenames = []) {
  return new Promise((resolve, reject) => {
    glob(`${quizzesDataDirectory}/**/${filenames.length === 0 ? '*' : `+(${filenames.join('|')})`}.json`, (error, files) => {
      if (error) {
        reject(`An error occurred while getting the files --> ${error.toString()}`)
      }
      resolve(files)
    })
  })
}

/**
 * Get the arguments from command line (since argument 2).
 */
function getSelectedFiles() {
  return process.argv.map(arg => arg).slice(2)
}