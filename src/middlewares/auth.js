const jwt = require('jsonwebtoken')
const { APP_KEY } = process.env
const response = require('../helpers/response')

exports.authCheck = (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.substring(7)
      const data = jwt.verify(token, APP_KEY)
      if (data) {
        req.userData = data
        return next()
      }
    }
    return response.responseStatus(res, 401, false, 'Authorization needed')
  } catch (error) {
    return response.responseStatus(res, 400, false, 'Please try again later')
  }
}