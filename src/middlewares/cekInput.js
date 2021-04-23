const { check, validationResult } = require('express-validator')

exports.validationInput = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg

        })
    }
    return next()
}

exports.validationLogin = [
    check('email', "Email can't be empty").notEmpty().isEmail().withMessage('Please enter email correctly'),
    check('password', "Password can't be empty").notEmpty().isLength(6).withMessage('Password length must be six characters')
]

exports.validationRegis = [
    check('name', "Name can't be empty").notEmpty(),
    check('email', "Email can't be empty").notEmpty().isEmail().withMessage('Please enter email correctly'),
    check('password', "Password can't be empty").notEmpty().isLength(6).withMessage('Password length must be six characters')
]
