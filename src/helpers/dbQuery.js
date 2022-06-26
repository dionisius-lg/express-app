const moment = require('moment-timezone')
const config = require('./../configs')
const conn   = require('./../configs/database')
const filterHelper = require('./filter')
const _      = require('lodash')

moment.tz.setDefault(config.timezone)

exports.checkColumn = ({ table = '' }) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${config.db.name}' AND TABLE_NAME = '${table}'`

        conn.query(query, (err, rows, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return
            }

            const columns = rows.map((i) => {
                return i.COLUMN_NAME
            })

            resolve(columns)
        })
    })
}

exports.countData = ({ table = '', conditions = {}, conditionTypes = { 'like': [], 'date': [] }, customConditions = [], join = {}, groupBy = {}, having = {} }) => {
    return new Promise((resolve, reject) => {
        let res        = { total_data: 0, data: false }
        let setCond    = []
        let queryCond  = ''
        let query      = `SELECT COUNT(*) AS count FROM ${table}`
        let queryCount = ''

        if (!_.isEmpty(join) && _.isArrayLikeObject(join)) {
            let joinQuery = _.join(join, ' ')
            query += ` ${joinQuery}`
        }

        if (!_.isEmpty(conditions)) {
            for (key in conditions) {
                if (!_.isEmpty(conditionTypes)) {
                    if (_.indexOf(conditionTypes.date, key) >= 0) {
                        let val = (_.toNumber(conditions[key]) > 0) ? moment(conditions[key] * 1000) : moment(new Date())
                        setCond.push(`DATE(${table}.${key}) = ${conn.escape(val.format('YYYY-MM-DD'))}`)
                    } else if (_.indexOf(conditionTypes.like, key) >= 0) {
                        let keyLike = `%${conditions[key]}%`
                        setCond.push(`${table}.${key} LIKE ${conn.escape(keyLike)}`)
                    } else {
                        let is_array = conditions[key].constructor === Array
                        
                        if (is_array) {
                            setCond.push(`${table}.${key} IN (${conn.escape(conditions[key])})`)
                        } else {
                            setCond.push(`${table}.${key} = ${conn.escape(conditions[key])}`)
                        }
                    }
                } else {
                    let is_array = conditions[key].constructor === Array
                        
                    if (is_array) {
                        setCond.push(`${table}.${key} IN (${conn.escape(conditions[key])})`)
                    } else {
                        setCond.push(`${table}.${key} = ${conn.escape(conditions[key])}`)
                    }
                }
            }
            
            queryCond = _.join(setCond, ' AND ')
            query += ` WHERE ${queryCond}`
        }

        if (!_.isEmpty(customConditions) && _.isArrayLikeObject(customConditions)) {
            queryCond = ' WHERE ' + _.join(customConditions, ' AND ')

            if (!_.isEmpty(conditions)) {
                queryCond = ' AND ' + _.join(customConditions, ' AND ')
            }

            query += `${queryCond}`
        }

        if (!_.isEmpty(groupBy) && _.isArrayLikeObject(groupBy)) {
            let columnGroup = _.join(groupBy, ', ')
            query += ` GROUP BY ${columnGroup}`

            if (!_.isEmpty(having) && _.isArrayLikeObject(having)) {
                let havingClause = _.join(having, ' AND ')
                query += ` HAVING ${havingClause}`
            }

            queryCount = `SELECT COUNT(*) AS count FROM (${query}) AS count`
            query = queryCount
        }

        conn.query(query, (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return resolve(res)
            }

            const data = results[0].count

            resolve(data)
        })
    })
}

exports.getAll = ({ table = '', conditions = {}, conditionTypes = { 'like': [], 'date': [] }, customConditions = [], columnSelect = {}, columnDeselect = {}, customColumns = [], join = {}, groupBy = {}, customOrders= {}, having = {}, cacheKey = '' }) => {
    return new Promise(async (resolve, reject) => {
        let res     = { total_data: 0, data: false }
        let columns = await this.checkColumn({ table })
        let column  = ''

        const masterColumns   = columns
        const sortData        = ['ASC', 'DESC']

        let order = (!_.isEmpty(conditions.order)) ? conditions.order : columns[0]
            order = (_.indexOf(columns, order) >= 0) ? order : columns[0]

        if (conditions.order == false) {
            order = false;
        }

        let sort  = (_.indexOf(sortData, _.toUpper(conditions.sort)) >= 0) ? _.toUpper(conditions.sort) : 'ASC'
        let limit = (conditions.limit > 0) ? conditions.limit : 20

        if (conditions.limit == false) {
            limit = false;
        }
        
        let page = (conditions.page > 0) ? conditions.page : 1
        let setCond = []
        let queryCond = ''

        if (!_.isEmpty(columnSelect) && _.isArrayLikeObject(columnSelect)) {
            // filter data from all table columns, only keep selected columns
            let validColumn = _.intersection(columnSelect, columns)
            columns = validColumn
        }

        if (!_.isEmpty(columnDeselect) && _.isArrayLikeObject(columnDeselect)) {
            if (_.indexOf(columnDeselect, '*') >= 0) {
                // filter data, exclude all columns
                // let selectedColumn = _.difference(columns, deselectedColumn)
                columns = []
            } else {
                // filter data, get column to exclude from valid selected columns or table columns
                let deselectedColumn = _.intersection(columnDeselect, columns)
                // filter data, exclude deselected columns
                let selectedColumn = _.difference(columns, deselectedColumn)
                columns = selectedColumn
            }
        }

        if (!_.isEmpty(join) && _.isArrayLikeObject(join)) {
            // give prefix table to table columns
            let prefixColumn = columns.map(function (col) {
                return `${table}.${col}`
            })

            columns = prefixColumn
        }

        column = _.join(columns, ', ')

        if (!_.isEmpty(customColumns) && _.isArrayLikeObject(customColumns)) {
            if (_.isEmpty(columns)) {
                column += _.join(customColumns, ', ')
            } else {
                column += ', ' + _.join(customColumns, ', ')
            }
        }

        let query = `SELECT ${column} FROM ${table}`

        if (!_.isEmpty(join) && _.isArrayLikeObject(join)) {
            let joinQuery = _.join(join, ' ')
            query += ` ${joinQuery}`
        }

        // remove invalid column from conditions
        filterHelper.column(conditions, masterColumns)

        if (!_.isEmpty(conditions)) {
            for (key in conditions) {
                if (!_.isEmpty(conditionTypes)) {
                    if (_.indexOf(conditionTypes.date, key) >= 0) {
                        let val = (_.toNumber(conditions[key]) > 0) ? moment(conditions[key] * 1000) : moment(new Date())
                        setCond.push(`DATE(${table}.${key}) = ${conn.escape(val.format('YYYY-MM-DD'))}`)
                    } else if (_.indexOf(conditionTypes.like, key) >= 0) {
                        let keyLike = `%${conditions[key]}%`
                        setCond.push(`${table}.${key} LIKE ${conn.escape(keyLike)}`)
                    } else {                        
                        let is_array = conditions[key].constructor === Array

                        if (is_array) {
                            setCond.push(`${table}.${key} IN (${conn.escape(conditions[key])})`)
                        } else {
                            setCond.push(`${table}.${key} = ${conn.escape(conditions[key])}`)
                        }
                    }
                } else {
                    let is_array = conditions[key].constructor === Array
                        
                    if (is_array) {
                        setCond.push(`${table}.${key} IN (${conn.escape(conditions[key])})`)
                    } else {
                        setCond.push(`${table}.${key} = ${conn.escape(conditions[key])}`)
                    }
                }
            }
        }

        queryCond = _.join(setCond, ' AND ')
        query += (!_.isEmpty(queryCond)) ? ` WHERE ${queryCond}` : ''

        if (!_.isEmpty(customConditions) && _.isArrayLikeObject(customConditions)) {
            queryCond = ' WHERE ' + _.join(customConditions, ' AND ')

            if (!_.isEmpty(conditions)) {
                queryCond = ' AND ' + _.join(customConditions, ' AND ')
            }

            query += `${queryCond}`
        }

        if (!_.isEmpty(groupBy) && _.isArrayLikeObject(groupBy)) {
            let columnGroup = _.join(groupBy, ', ')
            query += ` GROUP BY ${columnGroup}`

            if (!_.isEmpty(having) && _.isArrayLikeObject(having)) {
                let havingClause = _.join(having, ' AND ')
                query += ` HAVING ${havingClause}`
            }
        }

        if (!_.isEmpty(customOrders) && _.isArrayLikeObject(customOrders)) {
            query += ` ORDER BY ${customOrders}`
        } else {
            if (order !== undefined && !_.isEmpty(order)) {
                let orderColumn = order

                if (!_.isEmpty(join) && _.isArrayLikeObject(join)) {
                    orderColumn = `${table}.${order}`
                }
                query += ` ORDER BY ${orderColumn} ${sort}`
            }
        }

        if (limit > 0) {
            const offset = (limit * page) - limit

            if (_.isInteger(offset) && offset >= 0) {
                query += ` LIMIT ${limit} OFFSET ${offset}`
            } else {
                query += ` LIMIT ${limit}`
            }
        }
        
        let countData = await this.countData({ table, conditions, conditionTypes, customConditions, join, groupBy, having })

        conn.query(query, (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return resolve(res)
            }

            const data = {
                total_data: countData,
                limit: limit,
                page: page,
                data: results
            }

            resolve(data)
        })
    })
}

exports.getDetail = ({ table = '', conditions = {}, columnSelect = [], columnDeselect = [], customColumns = [], join = [], cacheKey = '' }) => {
    return new Promise(async (resolve, reject) => {
        let res     = { total_data: 0, data: false }
        let columns = await this.checkColumn({ table })
        let column  = ''

        let setCond   = []
        let queryCond = ''

        if (!_.isEmpty(columnSelect) && _.isArrayLikeObject(columnSelect)) {
            // filter data from all table columns, only keep selected columns
            let validColumn = _.intersection(columnSelect, columns)
            columns = validColumn
        }

        if (!_.isEmpty(columnDeselect) && _.isArrayLikeObject(columnDeselect)) {
            // filter data, get column to exclude from valid selected columns or table columns
            let deselectedColumn = _.intersection(columnDeselect, columns)
            // filter data, exclude deselected columns
            let selectedColumn = _.difference(columns, deselectedColumn)
            columns = selectedColumn
        }

        if (!_.isEmpty(join) && _.isArrayLikeObject(join)) {
            let prefixColumn = columns.map(function (col) {
                return `${table}.${col}`
            })

            columns = prefixColumn
        }

        column = _.join(columns, ', ')

        if (!_.isEmpty(customColumns) && _.isArrayLikeObject(customColumns)) {
            let append = ''

            if (column) {
                append = ', '
            }

            column += append + _.join(customColumns, ', ')
        }

        let query = `SELECT ${column}`

        if (table) {
            query += ` FROM ${table}`
        } 

        if (!_.isEmpty(join) && _.isArrayLikeObject(join)) {
            let joinQuery = _.join(join, ' ')
            query += ` ${joinQuery}`
        }

        if (!_.isEmpty(conditions)) {
            for (key in conditions) {
                let keyCondition = key

                if (!_.isEmpty(join) && _.isArrayLikeObject(join)) {
                    keyCondition = `${table}.${key}`
                }

                setCond.push(`${keyCondition} = ${conn.escape(conditions[key])}`)
            }

            queryCond = _.join(setCond, ' AND ')

            query += ` WHERE ${queryCond}`
        }

        if (table) {
            query += ` LIMIT 1`
        }

        conn.query(query, (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return resolve(res)
            }

            if (!_.isEmpty(results)) {
                res = {
                    total_data: 1,
                    limit: 0,
                    page: 1,
                    data: results[0]
                }
            }

            resolve(res)
        })
    })
}

exports.insertData = ({ table = '', data = {}, protectedColumns = [], cacheKeys = [] }) => {
    return new Promise(async (resolve, reject) => {
        let res      = { total_data: 0, data: false }
        let timeChar = ['CURRENT_TIMESTAMP()', 'NOW()']
        let nullChar = ['NULL', '']

        const columns = await this.checkColumn({ table })
        // remove invalid column from data
        filterHelper.column(data, columns)
        // remove invalid data
        filterHelper.data(data)

        if (_.isEmpty(data)) {
            // reject('Insert query require some data')
            return resolve(res)
        }

        let keys = Object.keys(data)
        // check protected columns on submitted data
        let forbiddenColumns = _.intersection(protectedColumns, keys)

        if (!_.isEmpty(forbiddenColumns)) {
            return resolve(res)
        }

        let column  = _.join(keys, ', ')
        let query   = `INSERT INTO ${table} (${column}) VALUES ?`
        let values  = []
        let tempVal = Object.keys(data).map(k => {
            let dataVal = ''

            if (typeof data[k] !== undefined) {
                dataVal = _.trim(data[k])

                if (_.indexOf(timeChar, _.toUpper(dataVal)) >= 0) {
                    dataVal = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                }

                if (_.indexOf(nullChar, _.toUpper(dataVal)) >= 0) {
                    dataVal = null
                }
            } else {
                dataVal = null
            }

            return dataVal
        })

        values.push(tempVal)

        conn.query(query, [values], (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return resolve(res)
            }

            res = {
                total_data: results.affectedRows,
                data: { id: results.insertId }
            }

            resolve(res)
        })
    })
}

exports.updateData = ({ table = '', data = {}, conditions = {}, protectedColumns = [], cacheKeys = [] }) => {
    return new Promise(async (resolve, reject) => {
        let res       = { total_data: 0, data: false }
        let timeChar  = ['CURRENT_TIMESTAMP()', 'NOW()']
        let nullChar  = ['NULL']
        let setData   = []
        let queryData = ''
        let setCond   = []
        let queryCond = ''
        let query     = `UPDATE ${table}`

        const columns = await this.checkColumn({ table })

        // remove invalid column from data
        filterHelper.column(data, columns)
        // remove invalid data
        filterHelper.data(data)
    
        if (_.isEmpty(conditions)) {
            // reject('Update query is unsafe without data and condition')
            if (_.isEmpty(data)) {
                return resolve(res)
            }
        }

        if (!_.isEmpty(data)) {
            const keys = Object.keys(data)
            // check protected columns on submitted data
            const forbiddenColumns = _.intersection(protectedColumns, keys)

            if (!_.isEmpty(forbiddenColumns)) {
                return resolve(res)
            }

            for (key in data) {
                let dataVal = _.trim(data[key])
                
                if (typeof data[key] !== undefined) {
                    if (_.indexOf(timeChar, _.toUpper(dataVal)) >= 0) {
                        dataVal = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                    }

                    if (_.indexOf(nullChar, _.toUpper(dataVal)) >= 0) {
                        dataVal = null
                    }
                } else {
                    dataVal = null
                }

                if (_.isEmpty(dataVal) && dataVal !== 0) {
                    setData.push(`${key} = NULL`)
                } else {
                    setData.push(`${key} = ${conn.escape(dataVal)}`)
                }
            }
        }

        queryData = _.join(setData, ', ')
        query += ` SET ${queryData}`

        if (!_.isEmpty(conditions)) {
            for (key in conditions) {
                if (_.isArray(conditions[key])) {
                    setCond.push(`${key} IN (${_.trim(conditions[key].join(','))})`)
                } else {
                    setCond.push(`${key} = ${conn.escape(_.trim(conditions[key]))}`)
                }
            }
        }

        queryCond = _.join(setCond, ' AND ')
        query += ` WHERE ${queryCond}`
        
        conn.query(query, (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return resolve(res)
            }

            res = {
                total_data: results.affectedRows,
                data: conditions
            }

            if (res.total_data < 1 || results.warningCount) {
                res.data = false
            }

            resolve(res)
        })
    })
}

exports.deleteData = ({ table = '', conditions = {}, cacheKeys = [] }) => {
    return new Promise(async (resolve, reject) => {
        let res       = { total_data: 0, data: false }
        let setCond   = []
        let queryCond = ''
        let query     = `DELETE FROM ${table}`

        if (_.isEmpty(conditions)) {
            // reject('Delete query is unsafe without condition')
            return resolve(res)
        }

        for (key in conditions) {
            setCond.push(`${key} = ${conn.escape(conditions[key])}`)
        }

        queryCond = _.join(setCond, ' AND ')

        query += ` WHERE ${queryCond}`

        conn.query(query, (err, results, fields) => {
            if (err) {
                // throw err
                console.error(err)
                return resolve(res)
            }

            res = {
                total_data: results.affectedRows,
                data: conditions
            }

            if (res.total_data == 0) {
                res.data = false
            }

            resolve(res)
        })
    })
}
