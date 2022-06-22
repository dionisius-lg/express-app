exports.pageDots = "..."

exports.pageRange = ({ total = 0, limit = 1, current = 0, sibling = 1 }) => {
    const range = (start, end) => {
        let length = end - start + 1
        return Array.from({ length }, (_, idx) => idx + start)
    }

    const totalPageCount = Math.ceil(total / limit)

    // Pages count is determined as sibling + firstPage + lastPage + currentPage + 2 * pageDots
    const totalPageNumbers = sibling + 5

    // If the number of pages is less than the page numbers we want to show in our
    // paginationComponent, we return the range [1..totalPageCount]
    if (totalPageNumbers >= totalPageCount) {
        return range(1, totalPageCount)
    }

    const leftSiblingIndex = Math.max(current - sibling, 1)
    const rightSiblingIndex = Math.min(
        current + sibling,
        totalPageCount
    )

    // We do not want to show pageDots if there is only one position left 
    // after/before the left/right page count as that would lead to a change if our Pagination
    // component size which we do not want
    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
        let leftItemCount = 3 + 2 * sibling
        let leftRange = range(1, leftItemCount)
        
        return [...leftRange, this.pageDots, totalPageCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
        let rightItemCount = 3 + 2 * sibling
        let rightRange = range(
            totalPageCount - rightItemCount + 1,
            totalPageCount
        )
        
        return [firstPageIndex, this.pageDots, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
        let middleRange = range(leftSiblingIndex, rightSiblingIndex)
        
        return [firstPageIndex, this.pageDots, ...middleRange, this.pageDots, lastPageIndex]
    }
}

exports.pageInfo = ({ total, limit, current }) => {
    let firstIndex = ((parseInt(current) * parseInt(limit)) - parseInt(limit)) + 1
    let lastIndex = parseInt(current) * parseInt(limit)
    let index = []

    if (lastIndex > total) {
        lastIndex = total
    }

    for (let i = firstIndex; i <= lastIndex; i++) {
        index.push(i)
    }

    return {
        lowest: firstIndex,
        highest: lastIndex,
        total: total,
        index: index
    }
}
