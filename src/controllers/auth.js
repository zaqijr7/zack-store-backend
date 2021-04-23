const userModel = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const response = require('../helpers/response')
const { APP_KEY, IP_URL_DEVICE, APP_PORT } = process.env
const nextLink = require('../helpers/nextLink')
const prevLink = require('../helpers/prevLink')

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
                return response.responseStatus(res, 200, true, 'Login Successfully', { token })
            }
        }
        return response.responseStatus(res, 404, false, 'Email or Password is Wrong')
    } catch (error) {
        return response.responseStatus(res, 400, false, 'Please try again later')
    }
}

exports.getAllUsers = async (req, res) => {
    const cond = req.query
    cond.search = cond.search || ''
    cond.page = Number(cond.page) || 1
    cond.limit = Number(cond.limit) || 3
    cond.dataLimit = cond.limit * cond.page
    cond.offset = (cond.page - 1) * cond.limit
    cond.sort = cond.sort || 'createdAt'
    cond.order = cond.order || 'ASC'
    try {
        const results = await userModel.getAllUsers(cond)
        const totalData = await userModel.totalData(cond)
        const dataFinall = []
        for (let index = 0; index < results.length; index++) {
            const FetchData = {
                id: results[index].id,
                name: results[index].name,
                email: results[index].email,
                pict: `${IP_URL_DEVICE}${APP_PORT}/${results[index].pict}` || null,
                role: results[index].role,
            }
            dataFinall.push(FetchData)
        }
        console.log(dataFinall, 'total data');
        if (results.length > 0) {
            res.status(200).json({
                success: true,
                message: 'List Users',
                results: dataFinall,
                pageInfo: {
                    totalData: totalData.length,
                    totalPage: Math.ceil(totalData.length / cond.limit),
                    dataCurrentPage: dataFinall.length,
                    currentPage: cond.page,
                    nextLink: nextLink.nextLinkUsers(cond, totalData, IP_URL_DEVICE, APP_PORT),
                    prevLink: prevLink.prevLinkUsers(cond, totalData, IP_URL_DEVICE, APP_PORT)
                }
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Opss Sorry, Users not Found'
            })
        }
    } catch (err) {
        return response.responseStatus(res, 400, false, 'Please try again later')
    }
}

exports.getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const dataUser = await userModel.getUsersByCondition({ id })
        const dataFinnally = {
            id: dataUser[0].id,
            name: dataUser[0].name,
            email: dataUser[0].email,
            pict: `${IP_URL_DEVICE}${APP_PORT}/${dataUser[0].pict}` || null,
            role: dataUser[0].role,
        }
        return response.responseStatus(res, 200, true, 'Detail User', dataFinnally)
    } catch (err) {
        return response.responseStatus(res, 400, false, 'Please try again later')
    }
}