const routes = require('express').Router()

const productController = require('../controllers/product')
const authMiddleware = require('../middlewares/auth')


routes.post('/add', authMiddleware.authCheck, productController.uploadProduct)
routes.patch('/update/:id', authMiddleware.authCheck, productController.updateProduct)
routes.get('/:id', authMiddleware.authCheck, productController.getProductById)
routes.delete('/:id', authMiddleware.authCheck, productController.deleteProductById)
routes.get('/', productController.getAllProducts)

module.exports = routes