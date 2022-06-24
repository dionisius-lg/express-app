const Joi = require('joi').extend(require('@joi/date'))

const schema = {
    detail: Joi.object().keys({
        id: Joi.number().min(1),
    }),
    create: Joi.object().keys({
        name: Joi.string().required().max(100).regex(/^[a-zA-Z0-9 ]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        sku: Joi.string().required().max(100).regex(/^[a-zA-Z0-9]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        buy_price: Joi.number().min(1),
        variant: Joi.string().max(30).regex(/^[a-zA-Z0-9 ]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        desctiption: Joi.string().max(255),
        product_category_id: Joi.number().min(1),
        product_unit_id: Joi.number().min(1),
        supplier_id: Joi.number().min(1).allow(null),
        supplied_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null),
        created_user_id: Joi.number().min(1).allow(null),
        created_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null),
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
        sku: Joi.string().required().max(100).regex(/^[a-zA-Z0-9]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        buy_price: Joi.number().min(1),
        variant: Joi.string().max(30).regex(/^[a-zA-Z0-9 ]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        desctiption: Joi.string().max(255),
        product_category_id: Joi.number().min(1),
        product_unit_id: Joi.number().min(1),
        supplier_id: Joi.number().min(1).allow(null),
        supplied_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null),
        updated_user_id: Joi.number().min(1).allow(null),
        udpated_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null),
        is_active: Joi.string().valid('0','1').allow(null)
    }),
    delete: Joi.object().keys({
        id: Joi.number().min(1),
    }),
}

module.exports = schema
