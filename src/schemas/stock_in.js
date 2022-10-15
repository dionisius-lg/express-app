const Joi = require('joi').extend(require('@joi/date'))

const schema = {
    detail: Joi.object().keys({
        id: Joi.number().min(1),
    }),
    create: Joi.object().keys({
        stock_type_id: Joi.number().min(1).allow(null).allow(''),
        product_id: Joi.number().min(1),
        supplier_id: Joi.string().min(1),
        note: Joi.string().max(255).allow(null).allow(''),
        stocked_date: Joi.date().format('YYYY-MM-DD').raw(),
        qty: Joi.number().min(1),
        // is_active: Joi.string().valid('0','1').allow(null).allow(''),
        created_date: Joi.any().strip(),
        created_user: Joi.any().strip(),
        updated_date: Joi.any().strip(),
        updated_user: Joi.any().strip(),
        product: Joi.string().required(),
        sku: Joi.string().required(),
        stock: Joi.string().required(),
    }),
    update: Joi.object().keys({
        stock_type_id: Joi.number().min(1).allow(null).allow(''),
        product_id: Joi.number().min(1),
        supplier_id: Joi.string().min(1),
        note: Joi.string().max(255).allow(null).allow(''),
        stocked_date: Joi.date().format('YYYY-MM-DD').raw(),
        qty: Joi.number().min(1),
        // is_active: Joi.string().valid('0','1').allow(null).allow(''),
        created_date: Joi.any().strip(),
        created_user: Joi.any().strip(),
        updated_date: Joi.any().strip(),
        updated_user: Joi.any().strip(),
        product: Joi.string().required(),
        sku: Joi.string().required(),
        stock: Joi.string().required(),
    }),
    delete: Joi.object().keys({
        id: Joi.number().min(1),
    }),
}

module.exports = schema
