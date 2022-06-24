const router = require('express').Router()
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const scriptName = path.basename(__filename)
const routePath = './src/routes'

router.get('/', (req, res) => {
    res.send({app: 'Express App'})
})

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
