const { getAll, getDetail, insertData, updateData, deleteData } = require('./../helpers/dbQuery')
const { success, error, notFound, notAllowed, badRequest, unauthorized } = require('./../helpers/response')
const table = 'product_units'

exports.getAll = async (conditions) => {
    const conditionTypes = {
        'like': ['name']
    }

    const result = await getAll({ table, conditions, conditionTypes })

    if (result.total_data > 0) {
        return success(result)
    }

    return notFound({})
}

exports.getDetail = async (conditions) => {
    const result = await getDetail({table, conditions})

    if (result.total_data > 0) {
        return success(result)
    }

    return notFound({})
}

exports.insert = async (data) => {
    const protectedColumns = ['id']
    const result = await insertData({ table, data, protectedColumns })

    if (result.total_data > 0) {
        return success(result)
    }

    return error({})
}

exports.update = async (data, conditions) => {
    const protectedColumns = ['id']
    const result = await updateData({ table, data, conditions, protectedColumns })

    if (result.total_data > 0) {
        return success(result)
    }

    return error({})
}

exports.delete = async (conditions) => {
    const result = await deleteData({ table, conditions })

    if (result.total_data > 0) {
        return success(result)
    }

    return error({})
}
