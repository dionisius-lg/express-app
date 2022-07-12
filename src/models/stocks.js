const { getAll, getDetail, insertData, updateData, deleteData } = require('../helpers/dbQuery')
const { success, error } = require('../helpers/response')
const table = 'stocks'

exports.getAll = async (conditions) => {
    let customConditions = []

    const conditionTypes = {
        'like': ['name']
    }

    const customColumns = [
        `created_user.fullname AS created_user`,
        `updated_user.fullname AS updated_user`,
    ]

    const join = [
        `LEFT JOIN users AS created_user ON created_user.id = ${table}.created_user_id`,
        `LEFT JOIN users AS updated_user ON updated_user.id = ${table}.updated_user_id`,
    ]

    const result = await getAll({ table, conditions, conditionTypes, customConditions, customColumns, join })

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

    const result = await getDetail({ table, conditions, customConditions, customColumns, join })

    if (result.total_data > 0) {
        return success(result)
    }

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
