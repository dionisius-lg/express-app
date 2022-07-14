const { getAll, getDetail, insertData, updateData, deleteData } = require('../helpers/dbQuery')
const { success, error } = require('../helpers/response')
const table = 'products'

exports.getAll = async (conditions) => {
    let customConditions = []

    if (conditions.sku_product !== undefined) {
        customConditions.push(`(${table}.sku LIKE '%${conditions.sku_product}%' OR ${table}.name LIKE '%${conditions.sku_product}%')`)
        delete conditions.sku_product
    }

    if (conditions.like_sku != undefined) {
        customConditions.push(`${table}.sku Like '%${conditions.like_sku}%'`)
        delete conditions.like_sku
    }

    const conditionTypes = {
        'like': ['name']
    }

    const customColumns = [
        `product_categories.name AS product_category`,
        `product_units.name AS product_unit`,
        `(
            (SELECT IFNULL(SUM(stk.qty), 0) FROM stocks AS stk
                WHERE stk.is_active = 1 AND stk.stock_type_id = 1 AND stk.product_id = ${table}.id)
            -
            (SELECT IFNULL(SUM(stk.qty), 0) FROM stocks AS stk
                WHERE stk.is_active = 1 AND stk.stock_type_id = 2 AND stk.product_id = ${table}.id)
        ) AS stock`,
        `created_user.fullname AS created_user`,
        `updated_user.fullname AS updated_user`,
    ]

    const join = [
        `LEFT JOIN product_categories ON product_categories.id = ${table}.product_category_id`,
        `LEFT JOIN product_units ON product_units.id = ${table}.product_unit_id`,
        `LEFT JOIN users AS created_user ON created_user.id = ${table}.created_user_id`,
        `LEFT JOIN users AS updated_user ON updated_user.id = ${table}.updated_user_id`,
    ]

    const groupBy = [
        `${table}.id`
    ]

    if (conditions.groupBy != undefined) {
        customConditions.push(`products.name Like '%${conditions.product}%'`)
    }

    const result = await getAll({ table, conditions, conditionTypes, customConditions, customColumns, join, groupBy })

    if (result.total_data > 0) {
        return success(result)
    }

    return error({message: "Data not found"})
}

exports.getDetail = async (conditions) => {
    let customConditions = []

    const customColumns = [
        `product_categories.name AS product_category`,
        `product_units.name AS product_unit`,
        `(
            (SELECT IFNULL(SUM(stk.qty), 0) FROM stocks AS stk
                WHERE stk.is_active = 1 AND stk.stock_type_id = 1 AND stk.product_id = ${table}.id)
            -
            (SELECT IFNULL(SUM(stk.qty), 0) FROM stocks AS stk
                WHERE stk.is_active = 1 AND stk.stock_type_id = 2 AND stk.product_id = ${table}.id)
        ) AS stock`,
        `created_user.fullname AS created_user`,
        `updated_user.fullname AS updated_user`,
    ]

    const join = [
        `LEFT JOIN product_categories ON product_categories.id = ${table}.product_category_id`,
        `LEFT JOIN product_units ON product_units.id = ${table}.product_unit_id`,
        `LEFT JOIN users AS created_user ON created_user.id = ${table}.created_user_id`,
        `LEFT JOIN users AS updated_user ON updated_user.id = ${table}.updated_user_id`,
    ]

    const groupBy = [
        `${table}.id`
    ]

    const result = await getDetail({ table, conditions, customConditions, customColumns, join, groupBy })

    if (result.total_data > 0) {
        return success(result)
    }

    return error({message: "Data not found"})
}

exports.insert = async (data) => {
    const protectedColumns = ['id']
    const result = await insertData({ table, data, protectedColumns })

    if (result.total_data > 0) {
        return success(result)
    }

    return error({message: "Bad request"})
}

exports.update = async (data, conditions) => {
    const protectedColumns = ['id']
    const result = await updateData({ table, data, conditions, protectedColumns })

    if (result.total_data > 0) {
        return success(result)
    }

    return error({message: "Bad request"})
}

exports.delete = async (conditions) => {
    const result = await deleteData({ table, conditions })

    if (result.total_data > 0) {
        return success(result)
    }

    return error({message: "Bad Request"})
}
