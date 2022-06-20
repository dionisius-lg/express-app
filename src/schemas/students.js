const Joi = require('joi').extend(require('@joi/date'))

const schema = {
    update: Joi.object().keys({
        name: Joi.string().required().max(100).regex(/^[a-zA-Z0-9 ]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })
    
            return errs
        }),
        email: Joi.string().email().allow(null).allow("").optional(),
        city: Joi.string().allow(null).allow("").optional()
    })
}

module.exports = schema
