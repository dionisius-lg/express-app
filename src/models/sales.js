const { getAll, getDetail, insertData, updateData, deleteData, insertManyData } = require('../helpers/dbQuery')
const { success, error } = require('../helpers/response')
const table = 'sales'

exports.getAll = async (conditions) => {
    if (conditions.is_active === undefined) {
        conditions.is_active = 1
    }

    const conditionTypes = {
        'like': ['name'],
        'date': ['created_date']
    }

    let customConditions = []

    // if (conditions.product != undefined) {
    //     customConditions.push(`products.name Like '%${conditions.product}%'`)
    // }

    // if (conditions.sku != undefined) {
    //     customConditions.push(`products.sku Like '%${conditions.sku}%'`)
    // }

    // if (conditions.supplier != undefined) {
    //     customConditions.push(`suppliers.name Like '%${conditions.supplier}%'`)
    // }

    const columnDeselect = [
        // 'stocked_date',
    ]

    const customColumns = [
        // `(CASE
        //     WHEN ${table}.stock_type_id = 1 THEN 'Stock In'
        //     WHEN ${table}.stock_type_id = 2 THEN 'Stock Out'
        //     ELSE NULL END) AS stock_type`,
        // `products.name AS product`,
        // `products.sku AS sku`,
        // `product_categories.name AS product_category`,
        // `product_units.name AS product_unit`,
        // `suppliers.name AS supplier`,
        // `DATE_FORMAT(${table}.stocked_date, "%Y-%m-%d") AS stocked_date`,
        // `((SELECT IFNULL(SUM(si.qty), 0) FROM stocks AS si
        //     WHERE si.is_active = 1 AND si.stock_type_id = 1 AND si.product_id = ${table}.product_id) -
        //     (SELECT IFNULL(SUM(so.qty), 0) FROM stocks AS so
        //         WHERE so.is_active = 1 AND so.stock_type_id = 2 AND so.product_id = ${table}.product_id)) AS stock`,
        // `created_user.fullname AS created_user`,
        // `updated_user.fullname AS updated_user`,
    ]

    const join = [
        // `LEFT JOIN products ON products.id = ${table}.product_id`,
        // `LEFT JOIN product_categories ON product_categories.id = products.product_category_id`,
        // `LEFT JOIN product_units ON product_units.id = products.product_unit_id`,
        // `LEFT JOIN suppliers ON suppliers.id = ${table}.supplier_id`,
        // `LEFT JOIN users AS created_user ON created_user.id = ${table}.created_user_id`,
        // `LEFT JOIN users AS updated_user ON updated_user.id = ${table}.updated_user_id`,
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
    if (conditions.is_active === undefined) {
        conditions.is_active = 1
    }

    let customConditions = []

    const columnDeselect = [
        // 'stocked_date',
    ]

    const customColumns = [
        // `(CASE
        //     WHEN ${table}.stock_type_id = 1 THEN 'Stock In'
        //     WHEN ${table}.stock_type_id = 2 THEN 'Stock Out'
        //     ELSE NULL END) AS stock_type`,
        // `products.name AS product`,
        // `products.sku AS sku`,
        // `product_categories.name AS product_category`,
        // `product_units.name AS product_unit`,
        // `suppliers.name AS supplier`,
        // `DATE_FORMAT(${table}.stocked_date, "%Y-%m-%d") AS stocked_date`,
        // `((SELECT IFNULL(SUM(si.qty), 0) FROM stocks AS si
        //     WHERE si.is_active = 1 AND si.stock_type_id = 1 AND si.product_id = ${table}.product_id) -
        //     (SELECT IFNULL(SUM(so.qty), 0) FROM stocks AS so
        //         WHERE so.is_active = 1 AND so.stock_type_id = 2 AND so.product_id = ${table}.product_id)) AS stock`,
        // `created_user.fullname AS created_user`,
        // `updated_user.fullname AS updated_user`,
        `customers.fullname AS customer_name`,
        `created_user.fullname AS created_user`,
    ]

    const join = [
        // `LEFT JOIN products ON products.id = ${table}.product_id`,
        // `LEFT JOIN product_categories ON product_categories.id = products.product_category_id`,
        // `LEFT JOIN product_units ON product_units.id = products.product_unit_id`,
        // `LEFT JOIN suppliers ON suppliers.id = ${table}.supplier_id`,
        `LEFT JOIN customers ON customers.id = ${table}.customer_id`,
        `LEFT JOIN users AS created_user ON created_user.id = ${table}.created_user_id`,
        // `LEFT JOIN users AS updated_user ON updated_user.id = ${table}.updated_user_id`,
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

exports.insertMany = async (data) => {
    const protectedColumns = ['id']
    const result = await insertManyData({table, data, protectedColumns})

    return result
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
