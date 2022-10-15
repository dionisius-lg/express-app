const router = require('express').Router()
const middleware = require('./../configs/middleware')
const controller = require('./../controllers/sales')
const schema = require('./../schemas/sales')

router.get('/', middleware.verifyLogin, controller.index)

router.get('/detail/:id', middleware.verifyLogin, middleware.validation(schema.detail, 'params'), controller.detail)

router.post('/create', middleware.verifyLogin, controller.create)

router.post('/update/:id', middleware.verifyLogin, middleware.validation(schema.update, 'body'), controller.update)

router.get('/delete/:id', middleware.verifyLogin, middleware.validation(schema.delete, 'params'), controller.delete)

router.get('/products', middleware.verifyLogin, controller.getProducts)

router.get('/customers', middleware.verifyLogin, controller.getCustomers)

router.get('/invoice', middleware.verifyLogin, controller.getInvoice)

router.get('/print/:id', middleware.verifyLogin, middleware.validation(schema.detail, 'params'), controller.print)

module.exports = router
