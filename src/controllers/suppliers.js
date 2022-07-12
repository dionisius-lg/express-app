const _ = require('lodash')
const moment = require('moment-timezone')
const path = require('path')
const currentPath = path.basename(__filename).split(".")[0]
const config = require('./../configs')
const { isEmpty, currentUrl } = require('../helpers/common')
const pagination = require('./../helpers/pagination')
const suppliersModel = require('../models/suppliers')

moment.tz.setDefault(config.timezone)

exports.index = async (req, res, next) => {
    const { query, params } = req
    const limit = 10

    Object.keys(query).forEach(key => {
        if (isEmpty(query[key])) {
            delete query[key]
        }
    })

    const getData = {
        [currentPath]: await suppliersModel.getAll({ limit: limit, ...query })
    }

    let result = {
        pagination: pagination({
            data: getData[currentPath] || {},
            opt: { url: currentUrl(req), limit: limit, ...query }
        })
    }

    Object.keys(getData).forEach((key) => {
        result[key] = {
            total_data: 0,
            data: []
        }

        if (getData[key].success) {
            result[key] = {
                total_data: getData[key].total_data,
                data: getData[key].data
            }

            if (key === currentPath) {
                result.paging = getData[key].paging
            }
        }
    })

    return res.render('adminLayout', {
        template: `${currentPath}`,
        pageTitle: 'Suppliers',
        ...result
    })
}

exports.detail = async (req, res, next) => {
    const { params } = req

    const result = await suppliersModel.getDetail({
        id: params.id
    })

    return res.json(result)
}

exports.create = async (req, res, next) => {
    const { body } = req

    if (!('is_active' in body)) {
        body.is_active = '1'
    }

    body.created_user_id = req.session.user.id
    body.created_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

    const result = await suppliersModel.insert(body)

    if (result.success) {
        req.flash('success', 'Data has been saved')
    }

    return res.json(result)
}

exports.update = async (req, res, next) => {
    const { body, params } = req

    if (!('is_active' in body)) {
        body.is_active = '0'
    }

    body.updated_user_id = req.session.user.id
    body.updated_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

    const result = await suppliersModel.update(body, {
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been updated')
    }

    return res.json(result)
}

exports.delete = async (req, res, next) => {
    const { params } = req

    const result = await suppliersModel.delete({
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been deleted')
    }

    return res.json(result)
}
