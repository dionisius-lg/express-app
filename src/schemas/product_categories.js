const Joi = require('joi').extend(require('@joi/date'))

const schema = {
    create: Joi.object().keys({
        name: Joi.string().required().max(100).regex(/^[a-zA-Z0-9 ]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        created_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null),
        created_user_id: Joi.number().min(1).allow(null),
        is_active: Joi.string().valid('0','1').allow(null)
    }),
    update: Joi.object().keys({
        name: Joi.string().required().max(100).regex(/^[a-zA-Z0-9 ]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        updated_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null),
        updated_user_id: Joi.number().min(1).allow(null),
        is_active: Joi.string().valid('0','1').allow(null)
    })
}

module.exports = schema
