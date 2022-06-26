const router = require('express').Router()
const middleware = require('./../configs/middleware')
const controller = require('./../controllers/product_units')
const schema = require('./../schemas/product_units')

router.get('/', middleware.verifyLogin, controller.index)

router.get('/detail/:id', middleware.verifyLogin, middleware.validation(schema.detail, 'params'), controller.detail)

router.post('/create', middleware.verifyLogin, middleware.validation(schema.create, 'body'), controller.create)

router.post('/update/:id', middleware.verifyLogin, middleware.validation(schema.update, 'body'), controller.update)

router.get('/delete/:id', middleware.verifyLogin, middleware.validation(schema.delete, 'params'), controller.delete)

module.exports = router
