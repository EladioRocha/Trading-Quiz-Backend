'use strict'

/**
 * @file users.js Middleware to manage the data from user.
 * @author Eladio Rocha Vizcaino
 */

/**
 * Middleware to manage the data from user.
 * @module middlewares/users
 * @requires path
 * @requires helpers/handleResponse
 * @requires helpers/sanitizerString
 * @requires services/userService
 * @param {express.Request} req - Object for request api.
 * @param {express.Response} res - Object for response api.
 * @param {express.Next} next - Callback to pass to next function.
 */

const path = require('path'),
  { response } = require(path.join(__dirname, '..', 'helpers', 'handleResponse')),
  sanitizer = require(path.join(__dirname, '..', 'helpers', 'sanitizerString')),
  userService = require(path.join(__dirname, '..', 'services', 'userService')),
  { compareHashString } = require(path.join(__dirname, '..', 'helpers', 'password'))

module.exports = {
  verifyNewUserData,
  verifyLoginFields,
  validPasswordProfileFields,
  isValidPassword,
  isValidEmail,
  isValidUsername
}

async function verifyNewUserData(req, res, next) {
  try {
    const { username, email, password } = sanitizer.sanitizeAllValluesInObjHTML(sanitizer.trimAllValuesInObj(req.body))

    if (!sanitizer.isValidLenString(username, 2, 20)) {
      return res.status(400).json({
        ...response(400, 'El nombre del usuario tiene una longitud invalida. 2 - 20'),
        data: null
      })
    }
    if (!sanitizer.isValidLenString(email, 6, 100)) {
      return res.status(400).json({
        ...response(400, 'El correo electronico tiene una longitud invalida. 6 - 50'),
        data: null
      })
    }
    if (!sanitizer.isValidLenString(password, 6, 100)) {
      return res.status(400).json({
        ...response(400, 'La contraseña tiene una longitud invalida. 6 - 100'),
        data: null
      })
    }
    if (username.indexOf(' ') >= 0) {
      return res.status(400).json({
        ...response(400, 'El nombre de usuario no puede contener espacios.'),
        data: null
      })
    }
    if (email.indexOf(' ') >= 0) {
      return res.status(400).json({
        ...response(400, 'El correo electronico no puede contener espacios.'),
        data: null
      })
    }
    if (await existUserInDb(email)) {
      return res.status(400).json({
        ...response(400, 'El correo electronico ya ha sido registrado anteriormente.'),
        data: null
      })
    }
    if (await existUserInDb(username)) {
      return res.status(400).json({
        ...response(400, 'El nombre de usuario ya ha sido registrado anteriormente.'),
        data: null
      })
    }
    res.locals.user = {
      username,
      email,
      password
    }

    next()
  } catch (error) {
    console.error(`Ha ocurrido un error al verificar la información del nuevo usuario --> ${error.toString()}`)
  }
}

async function existUserInDb(user) {
  try {
    return await userService.getUser(user)
  } catch (error) {
    console.error(`Ha ocurrido un error al verificar la existencia del correo en nuestra base de datos --> ${error.toString()}`)
  }
}

async function verifyLoginFields(req, res, next) {
  try {
    const { user, password } = sanitizer.sanitizeAllValluesInObjHTML(sanitizer.trimAllValuesInObj(req.body))

    if (!sanitizer.isValidLenString(user, 2, 100) ||
      user.indexOf(' ') >= 0 ||
      !sanitizer.isValidLenString(password, 6, 100)) {
      return res.status(400).json({
        ...response(400, 'El nombre de usuario o contraseña son invalidos.'),
        data: null
      })
    }

    res.locals.user = {
      user,
      password
    }

    next()
  } catch (error) {
    console.error(`Ha ocurrido un error al verificar la información del login del usuario --> ${error.toString()}`)
  }
}

async function validPasswordProfileFields(req, res, next) {
  try {
    const { password, newPassword } = sanitizer.sanitizeAllValluesInObjHTML(sanitizer.trimAllValuesInObj(req.body))
    if (!sanitizer.isValidLenString(password, 6, 100)) {
      return res.status(400).json({
        ...response(400, 'La contraseña actual es invalida.'),
        data: null
      })
    }
    if (!sanitizer.isValidLenString(newPassword, 6, 100)) {
      return res.status(400).json({
        ...response(400, 'La contraseña tiene una longitud invalida. 6 - 100.'),
        data: null
      })
    }
    if (password === newPassword) {
      return res.status(400).json({
        ...response(400, 'Las contraseñas no pueden ser iguales.'),
        data: null
      })
    }

    res.locals.user.password = password
    res.locals.user.newPassword = newPassword

    next()
  } catch (error) {
    console.error(`Ha ocurrido un error al verificar la contraseña del usuario --> ${error.toString()}`)
  }
}

async function isValidPassword(req, res, next) {
  try {
    const { password, email, user } = res.locals.user,
      hashPassword = await userService.getHashPasswordUser(email || user),
      validPassword = compareHashString(password, hashPassword)

    if(!hashPassword) {
      return res.status(400).json({
        ...response(400, 'Nombre de usuario o contraseña invalidos.'),
        data: null
      })
    }
    if (!validPassword) {
      return res.status(400).json({
        ...response(400, 'Campo de contraseña actual no valido.'),
        data: null
      })
    }

    next()
  } catch (error) {
    console.error(`Ha ocurrido un error al validar la contraseña del usuario --> ${error.toString()}`)
  }
}

async function isValidEmail(req, res, next) {
  try {
    const { email } = res.locals.user,
      { newEmail } = sanitizer.sanitizeAllValluesInObjHTML(sanitizer.trimAllValuesInObj(req.body))

    console.log('EMAIL: ', email, 'NEWEMAIL:', newEmail)
    if (email === newEmail) {
      return res.status(400).json({
        ...response(400, 'El correo no puede ser igual.'),
        data: null
      })
    }
    if (!sanitizer.isValidLenString(newEmail, 6, 50)) {
      return res.status(400).json({
        ...response(400, 'El correo electronico tiene una longitud invalida. 6 - 50.'),
        data: null
      })
    }
    if (newEmail.indexOf(' ') >= 0) {
      return res.status(400).json({
        ...response(400, 'El correo electronico no puede contener espacios.'),
        data: null
      })
    }
    if (await existUserInDb(newEmail)) {
      return res.status(400).json({
        ...response(400, 'El correo electronico ya ha sido registrado anteriormente.'),
        data: null
      })
    }

    res.locals.user.newEmail = newEmail
    next()
  } catch (error) {
    console.error(`Ha ocurrio un error al validar el correo del usuario --> ${error.toString()}`)
  }
}

async function isValidUsername(req, res, next) {
  try {
    const { username } = res.locals.user,
      { newUsername } = sanitizer.sanitizeAllValluesInObjHTML(sanitizer.trimAllValuesInObj(req.body))

    if (username === newUsername) {
      return res.status(400).json({
        ...response(400, 'El nombre de usuario no puede ser igual.'),
        data: null
      })
    }
    if (!sanitizer.isValidLenString(newUsername, 2, 20)) {
      return res.status(400).json({
        ...response(400, 'El nombre del usuario tiene una longitud invalida. 2 - 20'),
        data: null
      })
    }
    if (newUsername.indexOf(' ') >= 0) {
      return res.status(400).json({
        ...response(400, 'El nombre de usuario no puede contener espacios.'),
        data: null
      })
    }
    if (await existUserInDb(newUsername)) {
      return res.status(400).json({
        ...response(400, 'El nombre de usuario ya ha sido registrado anteriormente.'),
        data: null
      })
    }

    res.locals.user.newUsername = newUsername
    next()
  } catch (error) {
    console.error(`Ha ocurrio un error al validar el correo del usuario --> ${error.toString()}`)
  }
}