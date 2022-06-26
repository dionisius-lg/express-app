const { getAll, getDetail, insertData, updateData, deleteData } = require('../helpers/dbQuery')
const { success, error, notFound, notAllowed, badRequest, unauthorized } = require('../helpers/response')
const table = 'users'

exports.getAll = async (conditions) => {
    const conditionTypes = {
        'like': ['name']
    }

    let customConditions = []

    const customColumns = [
        
    ]

    const join = [
        
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
        
    ]

    const join = [
        
    ]

    const result = await getDetail({ table, conditions, customConditions, customColumns, join })

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
