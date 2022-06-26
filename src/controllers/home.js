const _ = require('lodash')
const moment = require('moment-timezone')
const path = require('path')
const currentPath = path.basename(__filename).split(".")[0]
const config = require('../configs')
const { isEmpty } = require('../helpers/common')

exports.dashboard = (req, res, next) => {
    return res.render('adminLayout', {
        template: `${currentPath}/dashboard`,
        pageTitle: 'Dashboard',
    })
}
