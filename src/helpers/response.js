const _ = require('lodash')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta')

exports.success = ({ total_data, limit, data, page }) => {
    let result = {
		request_time: moment().unix(),
		success: true,
		total_data: total_data || 0,
		data: data || {},
	}

    if (limit > 0 && total_data > 0) {
        const pageCurrent = _.toInteger(page)
		const pageNext = pageCurrent + 1
		const pagePrevious = pageCurrent - 1
		const pageFirst = 1
		const pageLast = _.ceil(total_data/limit)

        result.paging = {
			current: pageCurrent,
			next: (pageNext <= pageLast) ? pageNext : pageCurrent,
			previous: (pagePrevious > 0) ? pagePrevious : 1,
			first: pageFirst,
			last: (pageLast > 0) ? pageLast : 1
		}
    }

    return result
}

exports.error = (message = false) => {
    let result = {
		request_time: moment().unix(),
		success: false,
        message: "Internal server error"
	}

    if (message && !_.isEmpty(message)) {
        result.message += `. ${message}`
    }

    return result
}

exports.notFound = (message = false) => {
    let result = {
		request_time: moment().unix(),
		success: false,
        message: "Not Found"
	}

    if (message && !_.isEmpty(message)) {
        result.message += `. ${message}`
    }

    return result
}

exports.notAllowed = (message = false) => {
    let result = {
		request_time: moment().unix(),
		success: false,
        message: "Not allowed"
	}

    if (message && !_.isEmpty(message)) {
        result.message += `. ${message}`
    }

    return result
}

exports.badRequest = (message = false) => {
    let result = {
		request_time: moment().unix(),
		success: false,
        message: "Bad request"
	}

    if (message && !_.isEmpty(message)) {
        result.message += `. ${message}`
    }

    return result
}

exports.unauthorized = (message = false) => {
    let result = {
		request_time: moment().unix(),
		success: false,
        message: "Unauthorized"
	}

    if (message && !_.isEmpty(message)) {
        result.message += `. ${message}`
    }

    return result
}

exports.forbidden = (message = false) => {
    let result = {
		request_time: moment().unix(),
		success: false,
        message: "Forbidden"
	}

    if (message && !_.isEmpty(message)) {
        result.message += `. ${message}`
    }

    return result
}
