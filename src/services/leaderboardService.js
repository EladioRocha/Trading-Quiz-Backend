'use strict'

/**
 * @file leaderboardService.js The logic of leaderboard service.
 * @author Eladio Rocha Vizcaino
 */

/**
 * The logic of leaderboard service.
 * @module services/leaderboardService
 * @requires mongoose
 * @requires path
 * @requires models/Users
 */

const mongoose = require('mongoose'),
  path = require('path'),
  User = require(path.join(__dirname, '..', 'models', 'Users'))

module.exports = {
  getLeaders
}

async function getLeaders(page = 1, limit = 5) {
  try {
    const leaders = await User.paginate(
      {},
      {
        select: 'username coins',
        sort: { coins: -1 },
        customLabels: {
          docs: 'leaders'
        },
        page,
        limit
      },
    )

    return leaders
  } catch (error) {
    console.error(`An error occurred while getting the leaders in service --> ${error.toString()}`)
  }
}