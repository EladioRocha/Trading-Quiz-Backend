'use strict'

/**
 * @file updateFieldsLanguage.js Update fields from Quiz and Lessons
 * @author Eladio Rocha Vizcaino
 */

/**
 * Update fields to {key: value} to {key: {es: value, en: value}}
 * @requires mongoose
 * @requires path
 * @requires helpers/translateText
 * @requires models/Quizzes
 * @requires models/Lessons
 */

const mongoose = require('mongoose'),
  path = require('path'),
  { translate } = require(path.join(__dirname, 'translateText')),
  Quiz = require(path.join(__dirname, '..', 'models', 'Quizzes')),
  Lesson = require(path.join(__dirname, '..', 'models', 'Lessons'))

main()

async function main() {
  await mongoose.connect('mongodb://localhost:27017/tradingquiz')
  await getAllQuizzes()
  await getAllLessons()
}

async function getAllQuizzes() {
  const response = await translate(await Quiz.find({}).lean(), 'es')
  for(const object of response) {
    await updateDocument(Quiz, object._id, object)
  }
}

async function getAllLessons() {
  const response = await translate(await Lesson.find({}).lean(), 'es')
  for(const object of response) {
    await updateDocument(Lesson, object._id, object)
  }
}

async function updateDocument(model, _id, data) {
  _id = mongoose.Types.ObjectId(_id)
  await model.update(
    { _id },
    { $set: data }
  )
}