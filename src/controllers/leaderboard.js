'use strict'

/**
 * @file leaderboard.js Controllers of leaderboard requests.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Controllers of leaderboard requests. All methods receive the following params
 * @module controllers/leaderboard
 * @requires path
 * @requires helpers/handleResponse
 * @requires services/leaderboardService
 * @param {express.Request} req - Object for request api.
 * @param {express.Response} res - Object for response api.
 * @returns {Object} - Return status with state and data.
 */

const path = require('path'),
  { response } = require(path.join(__dirname, '..', 'helpers', 'handleResponse')),
  leaderboardService = require(path.join(__dirname, '..', 'services', 'leaderboardService'))

module.exports = {
  getLeaders
}

async function getLeaders(req, res) {
  try {
    let { page, limit } = req.query
    page = (page) ? parseInt(page) : page
    limit = (limit) ? parseInt(limit) : limit
    const leaders = await leaderboardService.getLeaders(page, limit)

    res.status(200).json({
      ...response(200),
      data: { ...leaders }
    })
  } catch (error) {
    console.error(`An error occurred while getting leaders in the controller --> ${error.toString()}`)
  }
}