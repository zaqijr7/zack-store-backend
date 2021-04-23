exports.responseStatus = (res, status, success, message, results, pageInfo) => {
    const result = {}
    result.status = status
    result.success = success
    result.message = message
    result.results = results
    result.pageInfo = pageInfo
    return res.status(result.status).json({
        ...result
    })
  }