'use strict'

/**
 * @file Users.js Users model mongoose.
 * @author Eladio Rocha Vizcaino
 */

/**
 * @requires mongoose
 * @requires mongoose-paginate-v3
 */

const mongoose = require('mongoose'),
  mongoosePaginate = require('mongoose-paginate-v3')

/**
 * Users
 */

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, minlength: 2, maxlength: 20 },
    email: { type: String, required: true, unique: true, minlength: 2, maxlength: 100 },
    /**
     * The password will be hashed.
     */
    password: { type: String, required: true, minlength: 6 },
    /**
     * Coins from user, per default has 50 coins.
     */
    coins: { type: Number, required: true, default: 50, index: true },
    /**
     * Mobile push notifications allow or not.
     */
    activeNotifications: { type: Boolean, required: true, default: true }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

UserSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('User', UserSchema)