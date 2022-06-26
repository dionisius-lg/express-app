const router = require('express').Router()
const middleware = require('./../configs/middleware')
const controller = require('./../controllers/users')
const schema = require('./../schemas/users')

router.get('/', middleware.verifyLogout, controller.auth)

router.post('/login', middleware.validation(schema.login, 'body'), controller.authLogin)

router.get('/logout', controller.authLogout)

module.exports = router
