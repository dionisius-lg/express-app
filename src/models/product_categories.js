const { getAll, getDetail, insertData, updateData, deleteData } = require('../helpers/dbQuery')
const { success, error } = require('../helpers/response')
const table = 'product_categories'

exports.getAll = async (conditions) => {
    const conditionTypes = {
        'like': ['name']
    }

    let customConditions = []

    if (conditions.created_user != undefined) {
        customConditions.push(`created_user.id = ${conditions.created_user}`)
    }

    if (conditions.updated_user != undefined) {
        customConditions.push(`updated_user.id = ${conditions.updated_user}`)
    }

    const customColumns = [
        `created_user.fullname AS created_user`,
        `updated_user.fullname AS updated_user`,
    ]

    const join = [
        `LEFT JOIN users AS created_user ON created_user.id = ${table}.created_user_id`,
        `LEFT JOIN users AS updated_user ON updated_user.id = ${table}.updated_user_id`,
    ]

    const groupBy = [
        `${table}.id`
    ]

    const result = await getAll({ table, conditions, conditionTypes, customConditions, customColumns, join, groupBy })

    if (result.total_data > 0) {
        return success(result)
    }

    return error({message: "Data not found"})
}

exports.getDetail = async (conditions) => {
    let customConditions = []

    const customColumns = [
        `created_user.fullname AS created_user`,
        `updated_user.fullname AS updated_user`,
    ]

    const join = [
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
