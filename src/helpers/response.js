const _ = require('lodash')
const moment = require('moment-timezone')
const { isEmpty } = require('./common')
const { pageInfo } = require('./../configs/pagination')

moment.tz.setDefault('Asia/Jakarta')

exports.success = ({ total_data, limit, data, page }) => {
    let result = {
		request_time: moment().unix(),
		success: true,
		total_data: total_data || 0,
		data: data || {},
	}

    if (limit > 0 && total_data > 0) {
        const current = _.toInteger(page)
		const next = current + 1
		const previous = current - 1
		const first = 1
		const last = _.ceil(total_data/limit)

        result.paging = {
			current: current,
			next: (next <= last) ? next : current,
			previous: (previous > 0) ? previous : 1,
			first: first,
			last: (last > 0) ? last : 1,
            index: pageInfo({ total_data, limit, current }).index
		}
    }

    return result
}

exports.error = ({ message, error }) => {
    let result = {
		request_time: moment().unix(),
		success: false,
        message: "Error"
	}

    if (message && !isEmpty(message) && _.isString(message)) {
        result.message += `. ${message}`
    }

    if (error && !isEmpty(error) && _.isObject(error)) {
        result.error = error
    }

    return result
}
