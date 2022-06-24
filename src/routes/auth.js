const router = require('express').Router()
const _ = require('lodash')
const bcrypt = require('bcrypt')
const verify = require('./../configs/verify')
const usersController = require('./../controllers/users')
const usersSchema = require('./../schemas/users')
const { badRequest } = require('./../helpers/response')
const { validator, currentUrl, fullUrl } = require('../helpers/common')

router.get('/', verify.isLogout, async (req, res, next) => {
    return res.render('authLayout', {
        pageTitle: 'Login',
        template: 'auth/login.ejs'
    })
})

router.get('/logout', async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err)
        }

        res.clearCookie('secretname')
        res.redirect('/auth')
    })
})

router.post('/login', async (req, res, next) => {
    const { body } = req
    const validation = validator(usersSchema.login, body)

    if (validation.error) {
        req.flash('error', 'Invalid credentials')
        return res.redirect('/auth')
    }

    const user = await usersController.getDetail({
        username: body.username
    })

    if (user.total_data === 0) {
        req.flash('error', 'User not found')
        return res.redirect('/auth')
    }

    if (bcrypt.compareSync(body.password, user.data.password)) {
        req.session.isLoggedIn = true
        req.session.user = {
            id: user.data.id,
            username: user.data.username,
            fullname: user.data.fullname,
            email: user.data.email,
        }

        return res.redirect('/products')
    }

    req.flash('error', 'Invalid credentials')
    return res.redirect('/auth')
})

module.exports = router
