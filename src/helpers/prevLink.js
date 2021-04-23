exports.prevLinkProducts = (cond, totalData, url, port) => {
    if (cond.page > 1) {
      return `${url}${port}/products?search=${cond.search}&page=${cond.page + 1}&limit=${cond.limit}&sort=${cond.sort}&order=${cond.order}`
    } else {
      return null
    }
  }