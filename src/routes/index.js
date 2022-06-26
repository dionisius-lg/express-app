const router = require('express').Router()
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const scriptName = path.basename(__filename)
const routePath = './src/routes'
const middleware = require('./../configs/middleware')
const controller = require('../controllers/home')

router.get('/', middleware.verifyLogin, controller.dashboard)

fs.readdirSync(routePath).forEach((file) => {
    // not including this file
    if (file != scriptName) {
        // get only filename, cut the file format (.js)
        const name = file.split('.')[0]
        router.use(`/${name.replace(/\_/g , "\-")}`, require(`./${name}`))
    }
})

router.all('*', (req, res) => {
    res.render('error', {
        message: 'Error',
        error: {
            status: 404,
            stack: 'The page you looking is not found.'
        }
    })
})

module.exports = router
