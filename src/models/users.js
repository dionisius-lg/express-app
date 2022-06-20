const dbQueryHelper = require('./../helpers/dbQuery')
const responseHelper = require('./../helpers/response')
const table = 'users'

exports.getAll = async (conditions) => {
    const conditionTypes = {
        'like': ['username', 'email', 'fullname']
    }

    const result = await dbQueryHelper.getAll({ table, conditions, conditionTypes })

    if (result.total_data > 0) {
        return responseHelper.success(result)
    }

    return responseHelper.notFound()
}

exports.getDetail = async (conditions) => {
    const result = await dbQueryHelper.getDetail({table, conditions})

    if (result.total_data > 0) {
        return responseHelper.success(result)
    }

    return responseHelper.notFound()
}

exports.insert = async (data) => {
    const protectedColumns = ['id']
    const result = await dbQueryHelper.insertData({ table, data, protectedColumns })

    if (result.total_data > 0) {
        return responseHelper.success(result)
    }

    return responseHelper.error()
}

exports.update = async (data, conditions) => {
    const protectedColumns = ['id']
    const result = await dbQueryHelper.updateData({ table, data, conditions, protectedColumns })

    if (result.total_data > 0) {
        return responseHelper.success(result)
    }

    return responseHelper.error()
}

exports.delete = async (conditions) => {
    const result = await dbQueryHelper.deleteData({ table, conditions })

    if (result.total_data > 0) {
        return responseHelper.success(result)
    }

    return responseHelper.error()
}
