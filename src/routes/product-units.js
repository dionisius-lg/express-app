const router = require('express').Router()
const _ = require('lodash')
const verify = require('./../configs/verify')
const productUnitsController = require('./../controllers/product_units')
const productUnitsSchema = require('./../schemas/product_units')
const { badRequest } = require('./../helpers/response')
const { validator, currentUrl, fullUrl } = require('../helpers/common')
const pagination = require('./../helpers/pagination')

router.get('/', verify.isLogin, async (req, res, next) => {
    const { query, params } = req
    const limit = 10

    let result = {
        product_units: await productUnitsController.getAll({ limit: limit, ...query })
    }

    result.pagination = pagination({
        data: result.product_units || {},
        opt: { url: currentUrl(req), limit: limit, ...query }
    })

    return res.render('adminLayout', {
        pageTitle: 'Product Units',
        template: 'product_units/index.ejs',
        ...result
    })
})

router.post('/create', async (req, res, next) => {
    const { body } = req
    const validation = validator(productUnitsSchema.create, body)

    if (!('is_active' in body)) {
        body.is_active = "1"
    }

    if (validation.error) {
        return res.json(badRequest({
            error: validation.error
        }))
    }

    const result = await productUnitsController.insert(body)

    if (result.success) {
        req.flash('success', 'Data has been saved')
    }

    return res.json(result)
})

router.get('/detail/:id', verify.isLogin, async (req, res, next) => {
    const { params } = req
    const validation = validator(productUnitsSchema.detail, params)

    if (validation.error) {
        return res.json(badRequest({
            error: validation.error
        }))
    }

    const result = await productUnitsController.getDetail({
        id: params.id
    })

    return res.json(result)
})

router.post('/update/:id', async (req, res, next) => {
    const { body, params } = req
    let validation = validator(productUnitsSchema.detail, params)

    if (validation.error) {
        return res.json(badRequest({
            error: validation.error
        }))
    }

    validation = validator(productUnitsSchema.update, body)

    if (!('is_active' in body)) {
        body.is_active = '0'
    }

    if (validation.error) {
        return res.json(badRequest({
            error: validation.error
        }))
    }

    const result = await productUnitsController.update(body, {
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been updated')
    }

    return res.json(result)
})

router.get('/delete/:id', async (req, res, next) => {
    const { params } = req
    const validation = validator(productUnitsSchema.detail, params)

    if (validation.error) {
        return res.json(badRequest({
            error: validation.error
        }))
    }

    const result = await productUnitsController.delete({
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been deleted')
    }

    return res.json(result)
})

module.exports = router
