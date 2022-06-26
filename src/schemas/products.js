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
        sku: Joi.string().max(100).regex(/^[a-zA-Z0-9]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        buy_price: Joi.number().min(1),
        // variant: Joi.string().max(30).regex(/^[a-zA-Z0-9 ]*$/).error(errs => {
        //     errs.forEach(err => {
        //         if (err.code === 'string.pattern.base') {
        //             err.message = `"${err.local.key}" format is invalid.`
        //         }
        //     })

        //     return errs
        // }),
        description: Joi.string().max(255).allow(null).allow(''),
        product_category_id: Joi.string().min(1),
        product_unit_id: Joi.string().min(1),
        // supplier_id: Joi.number().min(1).allow(null).allow(''),
        // supplied_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null).allow(''),
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
        sku: Joi.string().max(100).regex(/^[a-zA-Z0-9]*$/).error(errs => {
            errs.forEach(err => {
                if (err.code === 'string.pattern.base') {
                    err.message = `"${err.local.key}" format is invalid.`
                }
            })

            return errs
        }),
        buy_price: Joi.number().min(1),
        // variant: Joi.string().max(30).regex(/^[a-zA-Z0-9 ]*$/).error(errs => {
        //     errs.forEach(err => {
        //         if (err.code === 'string.pattern.base') {
        //             err.message = `"${err.local.key}" format is invalid.`
        //         }
        //     })

        //     return errs
        // }),
        description: Joi.string().max(255).allow(null).allow(''),
        product_category_id: Joi.string().min(1),
        product_unit_id: Joi.string().min(1),
        // supplier_id: Joi.number().min(1).allow(null).allow(''),
        // supplied_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null).allow(''),
        updated_user_id: Joi.number().min(1).allow(null).allow(''),
        udpated_date: Joi.date().format('YYYY-MM-DD HH:mm:ss').utc().allow(null).allow(''),
        is_active: Joi.string().valid('0','1').allow(null).allow('')
    }),
    delete: Joi.object().keys({
        id: Joi.number().min(1),
    }),
}

module.exports = schema
