const router = require('express').Router()
const bcrypt = require('bcrypt')
const _ = require('lodash')
const conn = require('./../configs/database')
const verify = require('./../configs/verify')

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
    const { username, password } = req.body

    let query = 'SELECT * FROM users where username = ?'

    conn.query(query, [username], (err, rows) => {
        if (err) throw err

        if (rows.length > 0) {
            if (bcrypt.compareSync(password, rows[0].password)) {
                console.log(rows[0].password, 'asd')
                req.session.isLoggedIn = true
                req.session.user = {
                    id: rows[0].id,
                    username: rows[0].username,
                    fullname: rows[0].fullname,
                    email: rows[0].email,
                }

                return res.redirect('/students')
            }

            req.flash('error', 'Invalid credentials')
        }

        res.redirect('/auth')
    })
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
