exports.isLogin = async (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        next()
        return
    }

    req.session.destroy((err) => {
        return res.redirect('/auth')
    })
}

exports.isLogout = async (req, res, next) => {
    if (req.session.isLoggedIn !== true) {
        next()
        return
    }

    return res.redirect('/')
}
