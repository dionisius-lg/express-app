const _ = require('lodash')
const classnames = require('classnames')
const { pageDots, pageRange, pageInfo } = require('./../configs/pagination')
const { isEmpty } = require('./common')

const paginationArrow = ({ paging, query }) => {
    console.log(paging, 'paging')
    console.log(query, 'query')
    // const { total_data, paging } = data

    if (isEmpty(paging)) {
        return `<div class="pb-2">Showing 0 to 0 of 0 entries</div>`
    }

    // const { current, first, last, previous, next } = paging
    // const { url, limit } = opt
    // const range = pageRange({ total_data, limit, current, sibling })
    // const info = pageInfo({ total_data, limit, current })
    // let numDots = 0
    // let query = ""

    // Object.keys(opt).forEach((i) => {
    //     if (['url', 'limit', 'page'].includes(i)) {
    //         delete opt[i]
    //     }

    //     if (!isEmpty(opt[i])) {
    //         query += `&${i}=${opt[i]}`
    //     }
    // })

    // const numPage = () => {
    //     let result = range.map(num => {
            
    //         if (num === pageDots) {
    //             numDots++
    //             return `<li class="page-item disabled"><span class="page-link">&#8230;</span></li>`
    //         }

    //         let pageLink = `<li class="${classnames('page-item', { 'active': num === current})}">`

    //         if (num === current) {
    //             pageLink += `<span class="page-link">${num}</span>`
    //         } else {
    //             pageLink += `<a href="${url}?page=${num}${query}" class="page-link">${num}</a>`
    //         }

    //         pageLink += `</li>`

    //         return pageLink
    //     })

    //     return result.join("\n")
    // }

    // return `
    //     <div class="pb-2">
    //         Showing ${info.lowest} to ${info.highest} of ${info.total} entries
    //     </div>
    //     <nav class="${classnames('float-right', { 'd-none': current === 0 || range.length < 2})}">
    //         <ul class="pagination mb-0 pb-0">
    //             <li class="${classnames('page-item', { 'd-none': current === first})}">
    //                 <a href="${url}?page=${previous}${query}" class="page-link">Prev</a>
    //             </li>
    //             ${numPage()}
    //             <li class="${classnames('page-item', { 'd-none': current === last})}">
    //                 <a href="${url}?page=${next}${query}" class="page-link">Next</a>
    //             </li>
    //         </ul>
    //     </nav>
    // `
}

module.exports = paginationArrow
