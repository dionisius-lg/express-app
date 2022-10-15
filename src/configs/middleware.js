const { error } = require('./../helpers/response')
const { sentenceCase } = require('./../helpers/common')

exports.verifyLogin = async (req, res, next) => {
    if (req.session.isLoggedIn === true) {
        next()
        return
    }

    req.session.destroy((err) => {
        if (req.xhr) {
            const resXhr = error({ message: "Unauthorized"})

            return res.json({
                ...resXhr,
                redirect: '/auth'
            })
        }

        return res.redirect('/auth')
    })
}

exports.verifyLogout = async (req, res, next) => {
    if (req.session.isLoggedIn !== true) {
        next()
        return
    }

    return res.redirect('/')
}

exports.validation = (schema, property) => {
    return (req, res, next) => {
        const validate = schema.validate(req[property], {
            abortEarly: false,
            convert: true
        })

        if (validate.error) {
            let errors = {}

            validate.error.details.forEach((errorDetail) => {
                let key = errorDetail.path.toString()
                let val = errorDetail.message.replace(/"/g,"")

                errors[key] = sentenceCase(val.replace(key, "this field"))
            })

            const resError = error({ message: "Bad request"})

            if (req.xhr) {
                return res.json({
                    ...resError,
                    formError: errors
                })
            }

            req.flash('formError', JSON.stringify(errors))
            return res.status(400).redirect('back')
        } else {
            // console.log(validate)
            req.body = validate.value
            next()
        }
    }
}
