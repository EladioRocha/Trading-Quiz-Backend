'use strict'

/**
 * @file index.js This is the root file and this is the first executed file.
 * @author Eladio Rocha Vizcaino
 */

const express = require('express'),
  morgan = require('morgan'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  env = require('dotenv'),
  path = require('path'),
  v1 = require(path.join(__dirname, 'routes', 'v1')),
  app = express()

env.config({ path: path.join(__dirname, '..', '.env') })
/******************** CONNECT DATABASE ********************/

mongoose.connect(process.env.MONGO_URI_DEV)

/******************** LOAD APP MIDDLEWARES ********************/
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))

/******************** LOAD API ROUTES ********************/
app.use('/v1', v1)

app.listen(process.env.PORT || process.env.PORT_DEV, _ => console.log('SERVER RUN'))