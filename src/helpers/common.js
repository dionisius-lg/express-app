const _ = require('lodash')
const url = require('node:url')
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

exports.sentenceCase = (str) => {
    str = ( str === undefined || str === null ) ? '' : str

    return str.toString().replace( /(^|\. *)([a-z])/g, function(match) {
		return match.toUpperCase()
    })
}

exports.strTok = (str, delim = null) => {
    if (this.isEmpty(delim)) delim = " "
    let i = str.indexOf(delim)
    if (i === -1) return str
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

    // if (!this.isEmpty(port) && !_.isNaN(port)) {
    //     result.port = port
    // }

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

    // if (!this.isEmpty(port) && !_.isNaN(port)) {
    //     result.port = port
    // }

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

    // if (!this.isEmpty(port) && !_.isNaN(port)) {
    //     result.port = port
    // }

    return url.format(result)
}
