const userModel = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const { APP_KEY } = process.env

exports.register = async (req, res) => {
    const { name, email, password } = req.body
    const role = 'ADMIN'
    try {
        const emailExist = await userModel.getUsersByCondition({ email })
        if (emailExist.length > 0) {
            return response.responseStatus(res, 400, false, 'User is exist')
        }
        const salt = await bcrypt.genSalt()
        const encryptedPassword = await bcrypt.hash(password, salt)
        const createUser = await userModel.createUser({ name, email, password: encryptedPassword, role: role })
        if (createUser.affectedRows > 0) {
            const result = await userModel.getUserById(createUser.insertId)
            const dataUser = {
                email: result[0].email
            }
            return response.responseStatus(res, 200, true, 'Register Successfully', dataUser, null)
        }
    } catch (err) {
        return response.responseStatus(res, 400, false, 'Please try again later')
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await userModel.getUsersByCondition({ email })
        if (existingUser.length > 0) {
            const compare = await bcrypt.compare(password, existingUser[0].password)
            if (compare) {
                const id = existingUser[0].id
                const email = existingUser[0].email
                const role = existingUser[0].role
                const token = jwt.sign({ id, email, role }, APP_KEY)
                return response.responseStatus(res, 200, true, 'Login Successfully', {token})
            }
        }
        return response.responseStatus(res, 404, false, 'Email or Password is Wrong')
    } catch (error) {
        return response.responseStatus(res, 400, false, 'Please try again later')
    }
}