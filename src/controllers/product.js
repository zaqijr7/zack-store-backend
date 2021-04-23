const productModels = require('../models/products')
const response = require('../helpers/response')
const nextLink = require('../helpers/nextLink')
const prevLink = require('../helpers/prevLink')
const upload = require('../helpers/uploads').single('pict')
const multer = require('multer')
const { APP_URL, APP_PORT, IP_URL_DEVICE } = process.env

exports.uploadProduct = async (req, res) => {
    upload(req, res, async err => {
        const data = req.body
        if (err instanceof multer.MulterError) {
            response.errorUploadPict(res)
        } else if (err) {
            response.errorUploadPict(res)
        }
        try {
            const formData = {
                name: data.name,
                description: data.description,
                price: data.price,
                pict: `${req.file.destination}/${req.file.filename}` || null
            }
            const addProduct = await productModels.addProduct(formData)
            const dataProd = await productModels.getProductCondition({ id: addProduct.insertId })
            const dataFinnally = {
                id: dataProd[0].id,
                name: dataProd[0].name,
                description: dataProd[0].description,
                price: dataProd[0].price,
                pict: `${APP_URL}${APP_PORT}/${dataProd[0].pict}`
            }
            console.log(dataFinnally, '<<<<<<<ini produk');

            return response.responseStatus(res, 200, true, 'Add Product Successfully', dataFinnally)
        } catch (err) {
            return response.responseStatus(res, 400, false, 'Please try again later')
        }
    })
}

exports.updateProduct = async (req, res) => {
    upload(req, res, async err => {
        const data = req.body
        const { id } = req.params
        if (err instanceof multer.MulterError) {
            response.errorUploadPict(res)
        } else if (err) {
            response.errorUploadPict(res)
        }
        try {
            if (req.file) {
                const pict = `${req.file.destination}/${req.file.filename}` || null
                await productModels.updateProduct(id, { ...data, pict })
                const dataProd = await productModels.getProductCondition({ id })
                const dataFinnally = {
                    id: dataProd[0].id,
                    name: dataProd[0].name,
                    description: dataProd[0].description,
                    price: dataProd[0].price,
                    pict: `${APP_URL}${APP_PORT}/${dataProd[0].pict}`
                }
                console.log(dataFinnally, '<<<<<<<ini produk');

                return response.responseStatus(res, 200, true, 'Add Product Successfully', dataFinnally)
            }
            await productModels.updateProduct(id, { ...data })
            const dataProd = await productModels.getProductCondition({ id })
            const dataFinnally = {
                id: dataProd[0].id,
                name: dataProd[0].name,
                description: dataProd[0].description,
                price: dataProd[0].price,
                pict: `${APP_URL}${APP_PORT}/${dataProd[0].pict}`
            }
            console.log(dataFinnally, '<<<<<<<ini produk');

            return response.responseStatus(res, 200, true, 'Add Product Successfully', dataFinnally)
        } catch (err) {
            return response.responseStatus(res, 400, false, 'Please try again later')
        }
    })
}

exports.getProductById = async (req, res) => {
    const { id } = req.params
    try {
        const dataProd = await productModels.getProductCondition({ id })
        const dataFinnally = {
            id: dataProd[0].id,
            name: dataProd[0].name,
            description: dataProd[0].description,
            price: dataProd[0].price,
            pict: `${APP_URL}${APP_PORT}/${dataProd[0].pict}`
        }
        return response.responseStatus(res, 200, true, 'Add Product Successfully', dataFinnally)
    } catch (err) {
        return response.responseStatus(res, 400, false, 'Please try again later')
    }
}

exports.getAllProducts = async (req, res) => {
    const cond = req.query
    cond.search = cond.search || ''
    cond.page = Number(cond.page) || 1
    cond.limit = Number(cond.limit) || 3
    cond.dataLimit = cond.limit * cond.page
    cond.offset = (cond.page - 1) * cond.limit
    cond.sort = cond.sort || 'createdAt'
    cond.order = cond.order || 'ASC'
    try {
      const results = await productModels.getAllProducts(cond)
      console.log(results);
      const totalData = await productModels.totalData(cond)
      const dataFinall = []
      for (let index = 0; index < results.length; index++) {
        const FetchData = {
          id: results[index].id,
          name: results[index].name,
          description: results[index].description,
          pict: `${IP_URL_DEVICE}${APP_PORT}/${results[index].pict}`,
        }
        dataFinall.push(FetchData)
      }
      if (results.length > 0) {
        res.status(200).json({
          success: true,
          message: 'List Products',
          results: dataFinall,
          pageInfo: {
            totalData: totalData.length,
            totalPage: Math.ceil(totalData.length / cond.limit),
            dataCurrentPage: dataFinall.length,
            currentPage: cond.page,
            nextLink: nextLink.nextLinkProducts(cond, totalData, IP_URL_DEVICE, APP_PORT),
            prevLink: prevLink.prevLinkProducts(cond, totalData, IP_URL_DEVICE, APP_PORT)
          }
        })
      } else {
        res.status(404).json({
          success: false,
          message: 'Opss Sorry, Products not Found'
        })
      }
    } catch (err) {
        return response.responseStatus(res, 400, false, 'Please try again later')
    }
  }