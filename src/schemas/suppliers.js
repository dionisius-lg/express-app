const Joi = require('joi').extend(require('@joi/date'))

const schema = {
    detail: Joi.object().keys({
        id: Joi.number().min(1),
    }),
    create: Joi.object().keys({
        name: Joi.string().max(100).regex(/^[a-zA-Z0-9 ]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        address: Joi.string().max(255).allow(null).allow(''),
        phone: Joi.string().max(30).regex(/^[0-9]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }).allow(null).allow(''),
        created_user_id: Joi.number().min(1).allow(null).allow(''),
        created_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null).allow(''),
        is_active: Joi.string().valid('0','1').allow(null).allow('')
    }),
    update: Joi.object().keys({
        name: Joi.string().max(100).regex(/^[a-zA-Z0-9 ]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        address: Joi.string().max(255).allow(null).allow(''),
        phone: Joi.string().max(30).regex(/^[0-9]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }).allow(null).allow(''),
        updated_user_id: Joi.number().min(1).allow(null).allow(''),
        updated_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null).allow(''),
        is_active: Joi.string().valid('0','1').allow(null).allow('')
    }),
    delete: Joi.object().keys({
        id: Joi.number().min(1),
    }),
}

module.exports = schema
