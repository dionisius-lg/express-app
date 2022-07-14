const { getAll, getDetail, insertData, updateData, deleteData } = require('../helpers/dbQuery')
const { success, error } = require('../helpers/response')
const table = 'stocks'

exports.getAll = async (conditions) => {
    let customConditions = []

    if (conditions.product != undefined) {
        customConditions.push(`products.name Like '%${conditions.product}%'`)
    }

    if (conditions.sku != undefined) {
        customConditions.push(`products.sku Like '%${conditions.sku}%'`)
    }

    if (conditions.supplier != undefined) {
        customConditions.push(`suppliers.name Like '%${conditions.supplier}%'`)
    }

    const conditionTypes = {
        'like': ['name']
    }

    const columnDeselect = [
        'stocked_date',
    ]

    const customColumns = [
        `(CASE
            WHEN ${table}.stock_type_id = 1 THEN 'Stock In'
            WHEN ${table}.stock_type_id = 2 THEN 'Stock Out'
            ELSE NULL END) AS stock_type`,
        `products.name AS product`,
        `products.sku AS sku`,
        `suppliers.name AS supplier`,
        `DATE_FORMAT(${table}.stocked_date, "%Y-%m-%d") AS stocked_date`,
        `((SELECT IFNULL(SUM(si.qty), 0) FROM stocks AS si
            WHERE si.is_active = 1 AND si.stock_type_id = 1 AND si.product_id = ${table}.product_id) -
            (SELECT IFNULL(SUM(so.qty), 0) FROM stocks AS so
                WHERE so.is_active = 1 AND so.stock_type_id = 2 AND so.product_id = ${table}.product_id)) AS stock`,
        `created_user.fullname AS created_user`,
        `updated_user.fullname AS updated_user`,
    ]

    const join = [
        `LEFT JOIN products ON products.id = ${table}.product_id`,
        `LEFT JOIN suppliers ON suppliers.id = ${table}.supplier_id`,
        `LEFT JOIN users AS created_user ON created_user.id = ${table}.created_user_id`,
        `LEFT JOIN users AS updated_user ON updated_user.id = ${table}.updated_user_id`,
    ]

    const groupBy = [
        `${table}.id`
    ]

    const result = await getAll({ table, conditions, conditionTypes, customConditions, columnDeselect, customColumns, join, groupBy })

    if (result.total_data > 0) {
        return success(result)
    }

    return error({message: "Data not found"})
}

exports.getDetail = async (conditions) => {
    let customConditions = []

    const columnDeselect = [
        'stocked_date',
    ]

    const customColumns = [
        `(CASE
            WHEN ${table}.stock_type_id = 1 THEN 'Stock In'
            WHEN ${table}.stock_type_id = 2 THEN 'Stock Out'
            ELSE NULL END) AS stock_type`,
        `products.name AS product`,
        `products.sku AS sku`,
        `suppliers.name AS supplier`,
        `DATE_FORMAT(${table}.stocked_date, "%Y-%m-%d") AS stocked_date`,
        `((SELECT IFNULL(SUM(si.qty), 0) FROM stocks AS si
            WHERE si.is_active = 1 AND si.stock_type_id = 1 AND si.product_id = ${table}.product_id) -
            (SELECT IFNULL(SUM(so.qty), 0) FROM stocks AS so
                WHERE so.is_active = 1 AND so.stock_type_id = 2 AND so.product_id = ${table}.product_id)) AS stock`,
        `created_user.fullname AS created_user`,
        `updated_user.fullname AS updated_user`,
    ]

    const join = [
        `LEFT JOIN products ON products.id = ${table}.product_id`,
        `LEFT JOIN suppliers ON suppliers.id = ${table}.supplier_id`,
        `LEFT JOIN users AS created_user ON created_user.id = ${table}.created_user_id`,
        `LEFT JOIN users AS updated_user ON updated_user.id = ${table}.updated_user_id`,
    ]

    const groupBy = [
        `${table}.id`
    ]

    const result = await getDetail({ table, conditions, customConditions, columnDeselect, customColumns, join, groupBy })

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

    return error({message: "Bad request"})
}
