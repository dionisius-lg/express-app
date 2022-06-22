const router = require('express').Router()
const _ = require('lodash')
const verify = require('./../configs/verify')
const usersModel = require('./../models/users')
// const usersSchema = require('./../schemas/users')
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
        users: await usersModel.getAll(conditions)
    }

    let asd = pagination({
        page: query.page || 1,
        total: getData.users.total_data,
        limit: limitData,
        paging: getData.users.paging || {}
    })

    return res.render('adminLayout', {
        pageTitle: 'Users',
        template: 'users/index.ejs',
        ...getData
    })
})

router.post('/create', async (req, res, next) => {
    const { body } = req
    // const validation = validator(userSchema.create, body)

    // if (validation.error) {
    //     return res.json(badRequest({
    //         error: validation.error
    //     }))
    // }

    const result = await usersModel.insert(body)

    if (result.success) {
        req.flash('success', 'Data has been saved')
    }

    return res.json(result)
})

router.get('/detail/:id', verify.isLogin, async (req, res, next) => {
    const { params } = req
    const result = await usersModel.getDetail({
        id: params.id
    })

    return res.json(result)
})

router.post('/update/:id', async (req, res, next) => {
    const { body, params } = req
    // const validation = validator(userSchema.update, body)

    // if (validation.error) {
    //     return res.json(badRequest({
    //         error: validation.error
    //     }))
    // }

    const result = await usersModel.update(body, {
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been updated')
    }

    return res.json(result)
})

router.get('/delete/:id', async (req, res, next) => {
    const { params } = req
    const result = await usersModel.delete({
        id: params.id
    })

    if (result.success) {
        req.flash('success', 'Data has been deleted')
    }

    return res.json(result)
})

// for existing endpoint with other request method
// router.all('*', (req, res) => {
//     res.render('error', {
//         message: 'Error',
//         error: {
//             status: 404,
//             stack: 'The page you looking is not found.'
//         }
//     })
// })

module.exports = router
