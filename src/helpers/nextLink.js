exports.nextLinkProducts = (cond, totalData, url, port) => {
    if (cond.dataLimit < totalData.length) {
        return `${url}${port}/products?search=${cond.search}&page=${cond.page + 1}&limit=${cond.limit}&sort=${cond.sort}&order=${cond.order}`
    } else {
        return null
    }
}

exports.nextLinkUsers = (cond, totalData, url, port) => {
    if (cond.dataLimit < totalData.length) {
        return `${url}${port}/users?search=${cond.search}&page=${cond.page + 1}&limit=${cond.limit}&sort=${cond.sort}&order=${cond.order}`
    } else {
        return null
    }
}