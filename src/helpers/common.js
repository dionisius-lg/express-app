const _ = require('lodash')
const fs = require('fs')
const url = require('node:url')
const moment = require('moment-timezone')
const config = require('./../configs')

exports.isEmpty = (val) => {
    return (
        val === undefined ||
        val === null ||
        (Array.isArray(val) && val.length === 0) ||
        (typeof val === 'object' && Object.keys(val).length === 0) ||
        (typeof val === 'string' && val.trim().length === 0) ||
        (typeof val === 'number' && val < 1)
    )
}

exports.isNumeric = (val) => {
    return (
        val === undefined ||
        val === null ||
        !isNaN(Number(val.toString()))
    )
}

exports.isJson = (val) => {
    value = typeof val !== "string" ? JSON.stringify(val) : val

    try {
        value = JSON.parse(value)
    } catch (e) {
        return false
    }

    if (typeof value === "object" && value !== null) {
        return true
    }

    return false
}

exports.validator = (schema, property, file = false) => { 
    const validation = schema.validate(property, {
        abortEarly: false
    })

    let result = { valid: true }

    if (validation.error) {
        result.valid = false
        result.error = {}

        validation.error.details.forEach((errorDetail) => {
            let key = errorDetail.path.toString()
            let val = errorDetail.message.replace(/"/g,"")

            result.error[key] = this.sentenceCase(val.replace(key, "this field"))
        })
    }

    return result
}

exports.upperCaseFirst = (str) => {
    let text  = str
    let parts = text.split(' ')
    let len   = parts.length
    let words = []

    for (let i = 0; i < len; i++) {
        let part  = parts[i]
        let first = part[0].toUpperCase()
        let rest  = part.substring(1, part.length)
        let word  = first + rest
        words.push(word)
    }

    return words.join(' ')
}

exports.capitalizeCase = (str) => {
    return str && str[0].toUpperCase() + str.slice(1)
}

exports.sentenceCase = (str) => {
    str = ( str === undefined || str === null ) ? '' : str

    return str.toString().replace( /(^|\. *)([a-z])/g, function(match) {
		return match.toUpperCase()
    })
}

exports.strTok = (str = false, delim = null) => {
    if (this.isEmpty(str)) {
        return ""
    }

    if (this.isEmpty(delim)) {
        delim = " "
    }

    let i = str.indexOf(delim)

    if (i === -1) {
        return str
    }

    let tok = str.substring(0, i)
    str = str.substring(i + 1)

    return tok
}

exports.baseUrl = (req) => {
    let result = {
        protocol: req.protocol,
        hostname:req.hostname,
        port: config.port || 80,
        pathname: '/'
    }

    return url.format(result)
}

exports.currentUrl = (req) => {
    let urlPath = req.originalUrl.split("?").shift()
    let result = {
        protocol: req.protocol,
        hostname:req.hostname,
        port: config.port || 80,
        pathname: urlPath
    }

    return url.format(result)
}

exports.fullUrl = (req) => {
    let urlPath = req.originalUrl.split("?").shift()
    let urlSearch = req.originalUrl.split("?")[1]
    let result = {
        protocol: req.protocol,
        hostname:req.hostname,
        port: config.port || 80,
        pathname: urlPath,
        search: urlSearch
    }

    return url.format(result)
}

exports.formatDate = (val) => {
    const date = moment(val)

    if (date.isValid()) {
        return date.format('YYYY-MM-DD')
    }

    return false
}

exports.formatDateTime = (val) => {
    const date = moment(val)

    if (date.isValid()) {
        return date.format('YYYY-MM-DD HH:mm:ss')
    }

    return false
}

exports.diffDate = (valOld, valNew) => {
    const dateNew = moment(valOld)
    const dateOld = moment(valNew)

    if (dateNew.isValid() && dateOld.isValid()) {
        return dateNew.diff(dateOld)
    }

    return false
}

exports.sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

exports.isEjs = (path) => {
    const pieces   = path.split("/")
    const lastPath = pieces[pieces.length - 1]

    if (this.isEmpty(lastPath)) {
        path += 'index'
    }

    try {
        try1 = fs.lstatSync(`src/views/${path}`)

        if (try1.isDirectory()) {
            return `${path}/index.ejs`
        }
    } catch(err) {
        try {
            try2 = fs.lstatSync(`src/views/${path}.ejs`)

            if (try2.isFile()) {
                return `${path}.ejs`
            }

            return false
        } catch (err2) {
            return false
        }
    }
}
