const dbQueryHelper = require('./../helpers/dbQuery')
const responseHelper = require('./../helpers/response')
const table = 'students'

exports.getAll = async (conditions) => {
    const conditionTypes = {
        'like': ['name', 'email', 'city']
    }

    const result = await dbQueryHelper.getAll({ table, conditions, conditionTypes })

    if (result.total_data > 0) {
        return responseHelper.success(result)
    }

    return responseHelper.notFound()
}

exports.getDetail = async (conditions) => {
    console.log(conditions, 'asd')
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
