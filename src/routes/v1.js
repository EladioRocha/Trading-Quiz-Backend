'use strict'

/**
 * @file v1.js This file contains all routes in this first version.
 * @author Eladio Rocha Vizcaino
 */

/**
 * This module has all routes available in api separated by section.
 * @module controllers/v1
 * @requires express
 * @requires path
 * @requires express-kun
 * @requires middlewares/auth
 * @requires middlewares/users
 * @requires controllers/users
 * @requires middlewares/quizzes
 * @requires controllers/quizzes
 */

const express = require('express'),
  path = require('path'),
  { isAuth } = require(path.join(__dirname, '..', 'middlewares', 'auth')),
  usersMiddleware = require(path.join(__dirname, '..', 'middlewares', 'users')),
  usersController = require(path.join(__dirname, '..', 'controllers', 'users')),
  quizzesMiddleware = require(path.join(__dirname, '..', 'middlewares', 'quizzes')),
  quizzesController = require(path.join(__dirname, '..', 'controllers', 'quizzes')),
  leaderboardMiddleware = require(path.join(__dirname, '..', 'middlewares', 'leaderboard')),
  leaderboardController = require(path.join(__dirname, '..', 'controllers', 'leaderboard')),
  notificationsMiddleware = require(path.join(__dirname, '..', 'middlewares', 'notifications')),
  notificationsController = require(path.join(__dirname, '..', 'controllers', 'notifications')),
  lessonsMiddleware = require(path.join(__dirname, '..', 'middlewares', 'lessons')),
  lessonsController = require(path.join(__dirname, '..', 'controllers', 'lessons'))

/**
 * This object has the methods like GET, POST, PUT, DELETE, etc.
 * @constant {express.Router}
 */
const v1 = express.Router()

// ==================== USERS ==================== //
v1.post('/users/create', usersMiddleware.verifyNewUserData, usersController.create)
v1.post('/users/login', [usersMiddleware.verifyLoginFields, usersMiddleware.isValidPassword], usersController.login)

v1.put('/users/reset/password', [isAuth, usersMiddleware.validPasswordProfileFields, usersMiddleware.isValidPassword], usersController.resetPassword)
v1.put('/users/reset/email', [isAuth, usersMiddleware.isValidEmail], usersController.updateEmail)
v1.put('/users/reset/username', [isAuth, usersMiddleware.isValidUsername], usersController.updateUsername)
v1.put('/users/notifications', isAuth, usersController.updateStatusNotifications)

// ==================== QUIZZES ==================== //
v1.get('/quizzes/answers/:answerId', isAuth, quizzesController.verifyAnswer)
v1.get('/quizzes/type/:type', isAuth, quizzesController.getMetadataQuizzes)
v1.get('/quizzes/:quizId', isAuth, quizzesController.getQuestions)

v1.post('/quizzes/result', isAuth, quizzesController.saveRecordUserQuizz)

// ==================== LEADERBOARD ==================== //
v1.get('/leaderboard', isAuth, leaderboardController.getLeaders)

// ==================== NOTIFICATIONS ==================== //
v1.get('/notifications/unviewed', isAuth, notificationsController.getUnviewed)

v1.put('/notifications/viewed', isAuth, notificationsController.markAsRead)

// ==================== LESSONS ==================== //
v1.get('/lessons/type/:type', isAuth, lessonsController.getMetadataLessons)
v1.get('/lessons/:lessonId', [isAuth, lessonsMiddleware.isValidLesson], lessonsController.getLesson)

v1.put('/lessons/lecture', isAuth, lessonsController.markAsRead)

module.exports = v1
