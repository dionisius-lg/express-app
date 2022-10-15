const _ = require('lodash')
const moment = require('moment-timezone')
const path = require('path')
const currentPath = path.basename(__filename).split(".")[0]
const config = require('../configs')
const { isEmpty } = require('../helpers/common')

exports.dashboard = (req, res, next) => {
    console.log(`${currentPath}/dashboard`)
    return res.render('adminLayout', {
        view: `${currentPath}/dashboard`,
        title: 'Dashboard',
    })
}
