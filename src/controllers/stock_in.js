const _ = require('lodash')
const moment = require('moment-timezone')
const path = require('path')
const currentPath = path.basename(__filename).split(".")[0]
const config = require('../configs')
const { isEmpty, currentUrl } = require('../helpers/common')
const pagination = require('../helpers/pagination')
const stocksModel = require('../models/stocks')
const suppliersModel = require('../models/suppliers')
const productsModel = require('../models/products')

moment.tz.setDefault(config.timezone)

exports.index = async (req, res, next) => {
    const { query, params } = req
    const limit = 10

    Object.keys(query).forEach(key => {
        if (isEmpty(query[key])) {
            delete query[key]
        }
    })

    query.stock_type_id = 1

    const getData = {
        [currentPath]: await stocksModel.getAll({ limit: limit, ...query }),
        suppliers: await suppliersModel.getAll({ limit: 100, is_active: 1, sort: "name" })
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
        view: `${currentPath}`,
        pageTitle: 'Stock In',
        ...result
    })
}

exports.detail = async (req, res, next) => {
    const { params } = req

    const result = await stocksModel.getDetail({
        id: params.id
    })

    return res.json(result)
}

exports.create = async (req, res, next) => {
    const { body } = req

    Object.keys(body).forEach(key => {
        if (['product', 'sku', 'stock'].includes(body)) {
            delete query[key]
        }
    })

    if (!('is_active' in body)) {
        body.is_active = '1'
    }

    body.stock_type_id = 1
    body.created_user_id = req.session.user.id
    body.created_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

    const result = await stocksModel.insert(body)

    if (result.success) {
        req.flash('success', 'Data has been saved')
    }

    return res.json(result)
}

exports.update = async (req, res, next) => {
    const { body, params } = req

    Object.keys(body).forEach(key => {
        if (['product', 'sku', 'stock'].includes(body)) {
            delete query[key]
        }
    })

    if (!('is_active' in body)) {
        body.is_active = '0'
    }

    body.stock_type_id = 1
    body.updated_user_id = req.session.user.id
    body.updated_date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

    const result = await stocksModel.update(body, {
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been updated')
    }

    return res.json(result)
}

exports.delete = async (req, res, next) => {
    const { params } = req

    const result = await stocksModel.delete({
        id: params.id,
        stock_type_id: 1
    })

    if (result.success) {
        req.flash('success', 'Data has been deleted')
    }

    return res.json(result)
}

exports.products = async (req, res, next) => {
    const { query } = req
    const limit = 10

    Object.keys(query).forEach(key => {
        if (isEmpty(query[key])) {
            delete query[key]
        }
    })

    const result = await productsModel.getAll({ limit: limit, ...query })

    return res.json(result)
}
