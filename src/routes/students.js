const router = require('express').Router()
const _ = require('lodash')
const conn = require('./../configs/database')
const verify = require('./../configs/verify')
const studentsModel = require('./../models/students')

router.get('/', verify.isLogin, async (req, res, next) => {
    let result = {
        students: await studentsModel.getAll()
    }

    return res.render('adminLayout', {
        pageTitle: 'Students',
        template: 'students/index.ejs',
        session: req.session,
        result: result
    })
})

router.post('/create', async (req, res, next) => {
	const result = await studentsModel.insert(req.body)

    if (result.success) {
        req.flash('error', 'Data has been saved')
    }

    return res.json(result)
})

router.get('/detail/:id', verify.isLogin, async (req, res, next) => {
    const conditions = {id: req.params.id}
    console.log(conditions, 'qweqwe')
	const result = await studentsModel.getDetail(conditions)

    return res.json(result)
})

router.post('/update/:id', async (req, res, next) => {
    const conditions = {id: req.params.id}
	const result = await studentsModel.update(req.body, conditions)

    if (result.success) {
        req.flash('error', 'Data has been updated')
    }

    return res.json(result)
})

router.get('/delete/:id', async (req, res, next) => {
    const conditions = {id: req.params.id}
	const result = await studentsModel.delete(conditions)

    if (result.success) {
        req.flash('error', 'Data has been deleted')
    }

    return res.json(result)
})

// for existing endpoint with other request method
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
