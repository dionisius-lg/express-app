const classnames = require('classnames')
const { pageDots, pageRange, pageInfo } = require('./../configs/pagination')

const pagination = ({ page, total, limit, paging, sibling = 1 }) => {
    let numDots = 0
    const { current, first, last, previous, next } = paging
    const range = pageRange({ total, limit, current, sibling })
    const info = pageInfo({ total, limit, current })

    const numPage = () => {
        range.map(num => {
            if (num === pageDots) {
                numDots++
                return `<li className="page-item disabled"><span className="page-link">&#8230;</span></li>`
            }

            let pageLink = `<li class="${classnames('page-item', { 'active': num === current})}">`

            if (num === current) {
                result += `<span className="page-link">${num}</span>`
            } else {
                result += `<a href="#" class="page-link">${num}</a>`
            }

            pageLink += `</li>`

            return pageLink
        })
    }

    return `
        <div class="py-2 border-top">
            Showing ${info.lowest} to ${info.highest} of ${info.total} entries
        </div>
        <nav class="${classnames('float-right', { 'd-none': current === 0 || range.length < 2})}">
            <ul className="pagination mb-0 pb-0">
                <li class="${classnames('page-item', { 'd-none': current === first})}">
                    <a href="#" class="page-link">Prev</a>
                </li>
            </ul>
        </nav>
    `
}

module.exports = pagination
