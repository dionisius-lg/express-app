const _ = require('lodash')
const moment = require('moment-timezone')
const path = require('path')
const currentPath = path.basename(__filename).split(".")[0]
const config = require('./../configs')
const { isEmpty, currentUrl } = require('../helpers/common')
const pagination = require('./../helpers/pagination')
const salesModel = require('../models/sales')
const salesItemsModel = require('../models/sales_items')
const productsModel = require('../models/products')
const productCategoriesModel = require('../models/product_categories')
const productUnitsModel = require('../models/product_units')
const customersModel = require('../models/customers')

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
        [currentPath]: await productsModel.getAll({ limit: limit, ...query }),
        product_categories: await productCategoriesModel.getAll({ limit: 100, is_active: 1, sort: "name" }),
        product_units: await productUnitsModel.getAll({ limit: 100, is_active: 1, sort: "name" }),
        customers: await customersModel.getAll({ limit: 100, is_active: 1, sort: "name" })
    }

    let result = {
        pagination: pagination({
            data: getData[currentPath] || {},
            opt: { url: currentUrl(req), limit: limit, ...query }
        }),
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
        title: 'Sales',
        ...result
    })
}

exports.detail = async (req, res, next) => {
    const { params } = req

    const result = await productsModel.getDetail({
        id: params.id
    })

    return res.json(result)
}

exports.create = async (req, res, next) => {
    const { body } = req

    const data = {
        invoice: body.invoice,
        customer_id: body.customer_id,
        pay_cash: body.pay.cash,
        pay_change: body.pay.change,
        discount: body.summaries.discount,
        created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        created_user_id: req.session.user.id
    }

    const result = await salesModel.insert(data)

    if (result.success) {
        const salesId  = result.data.id
        const items = body.products.map((i) => {
            return {
                sales_id: salesId,
                product_id: i.id,
                qty: i.qty,
                discount: i.discount,
                total: i.total,
                created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                created_user_id: req.session.user.id
            }
        })

        const resultItems = await salesItemsModel.insertMany(items)

        if (resultItems.success) {
            req.flash('success', 'Data has been saved')
        }
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

    const result = await productsModel.update(body, {
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been updated')
    }

    return res.json(result)
}

exports.delete = async (req, res, next) => {
    const { params } = req

    const result = await productsModel.delete({
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been deleted')
    }

    return res.json(result)
}

exports.getProducts = async (req, res, next) => {
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

exports.getCustomers = async (req, res, next) => {
    const { query } = req
    const limit = 10

    Object.keys(query).forEach(key => {
        if (isEmpty(query[key])) {
            delete query[key]
        }
    })

    const result = await customersModel.getAll({ limit: limit, ...query })

    return res.json(result)
}

exports.getInvoice = async (req, res, next) => {
    let result = 'INV' + moment(new Date()).format('YYYYMMDD')

    const getData = await salesModel.getAll({ limit: 100, is_active: 1, created_date: moment(new Date()).format('YYYY-MM-DD') })
    
    if (getData.success) {
        let n = parseInt(getData.total_data) + 1

        result += ('000' + n).slice(-3)
    } else {
        result += '001'
    }

    return res.json(result)
}

exports.print = async (req, res, next) => {
    const { params } = req

    const getData = {
        [currentPath]: await salesModel.getDetail({ id: params.id }),
        sales_items: await salesItemsModel.getAll({ limit: 100, is_active: 1, sales_id: params.id, sort: "name" }),
    }

    let result = {
        discount: 0,
        sub_total: 0,
        grand_total: 0,
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
        }
    })

    if (result.sales.total_data > 0) {
        result.discount += parseInt(result.sales.data.discount)
    }

    if (result.sales_items.total_data > 0) {
        result.sales_items.data.map((row, i) => {
            result.discount += parseInt(row.discount)
            result.sub_total += parseInt(row.total)
        })
    }

    result.grand_total = parseInt(result.sub_total) - parseInt(result.discount) 

    return res.render('printLayout', {
        view: `${currentPath}/print`,
        title: 'Sales',
        ...result
    })
}
