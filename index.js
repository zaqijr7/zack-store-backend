const express = require('express')
const BodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')

//<----------config----------->
dotenv.config()
const { APP_PORT } = process.env

const app = express()

app.use(BodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors('*'))
app.use('/uploads', express.static('uploads'))

//<----------------- routes-------------->
app.use('/auth', require('./src/routes/auth.js'))
app.use('/users', require('./src/routes/auth.js'))
app.use('/products', require('./src/routes/products'))

//<---------------port---------------->

app.listen(APP_PORT, () => {
    console.log(`Application is running opn port ${APP_PORT}`)
  })
  