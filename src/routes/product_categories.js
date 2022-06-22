const router = require('express').Router()
const _ = require('lodash')
const verify = require('./../configs/verify')
const productCategoriesModel = require('./../models/product_categories')
const productCategoriesSchema = require('./../schemas/product_categories')
const { badRequest } = require('./../helpers/response')
const { validator } = require('./../helpers/general')
const pagination = require('./../helpers/pagination')

router.get('/', verify.isLogin, async (req, res, next) => {
    const { query, params } = req
    const limitData = 20

    const conditions = {
        ...query,
        limit: limitData
    }

    const getData = {
        product_categories: await productCategoriesModel.getAll(conditions)
    }

    let asd = pagination({
        page: query.page || 1,
        total: getData.product_categories.total_data,
        limit: limitData,
        paging: getData.product_categories.paging || {}
    })

    return res.render('adminLayout', {
        pageTitle: 'Product Categories',
        template: 'product_categories/index.ejs',
        ...getData
    })
})

router.post('/create', async (req, res, next) => {
    const { body } = req
    const validation = validator(productCategoriesSchema.create, body)

    if (!('is_active' in body)) {
        body.is_active = "1"
    }

    if (validation.error) {
        return res.json(badRequest({
            error: validation.error
        }))
    }

    const result = await productCategoriesModel.insert(body)

    if (result.success) {
        req.flash('success', 'Data has been saved')
    }

    return res.json(result)
})

router.get('/detail/:id', verify.isLogin, async (req, res, next) => {
    const { params } = req
    const result = await productCategoriesModel.getDetail({
        id: params.id
    })

    return res.json(result)
})

router.post('/update/:id', async (req, res, next) => {
    const { body, params } = req
    const validation = validator(productCategoriesSchema.update, body)

    if (!('is_active' in body)) {
        body.is_active = '0'
    }

    if (validation.error) {
        return res.json(badRequest({
            error: validation.error
        }))
    }

    const result = await productCategoriesModel.update(body, {
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been updated')
    }

    return res.json(result)
})

router.get('/delete/:id', async (req, res, next) => {
    const { params } = req
    const result = await productCategoriesModel.delete({
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been deleted')
    }

    return res.json(result)
})

module.exports = router
