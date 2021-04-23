const routes = require('express').Router()

const authController = require('../controllers/auth.js')
const { validationRegis, validationLogin, validationInput } = require('../middlewares/cekInput')
routes.post('/register', validationRegis, validationInput, authController.register)
routes.patch('/login', validationLogin, validationInput, authController.login)

module.exports = routes