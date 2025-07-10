exports.getSearchParams = (req, filter = {}, opt = null) => {
  let options = {
    page: req.query.page || 1,
    limit: req.query.pageSize || req.query.limit || 10,
  }
  if (options.limit < 0) {
    options.limit = 10000
  }
  if (opt) {
    options = Object.assign({}, options, opt)
  }

  let q = req.body.filter || req.query.filter || {}
  let sort = req.body.sort || req.query.sort || {}
  let select = req.body.select || req.query.select || null
  let limit = req.body.limit || req.query.limit || null
  let populate = req.body.populate || req.query.populate || null

  if (q) {
    if (typeof q == 'string') {
      try {
        q = JSON.parse(q)
        filter = Object.assign({}, filter, q)
      } catch { }
    } else {
      filter = Object.assign({}, filter, q || {})
    }
  }

  if (sort) {
    if (typeof sort == 'string') {
      try {
        sort = JSON.parse(sort)
        options.sort = sort || {}
      } catch { }
    } else {
      options.sort = sort || {}
    }
  }

  if (select) {
    options.select = select
  }
  if (limit && !isNaN(limit)) {
    options.limit = Number(limit)
  }

  if (populate) {
    if (typeof populate == 'string') {
      try {
        populate = JSON.parse(populate)
        options.populate = populate
      } catch { }
    } else {
      options.populate = populate
    }
  }
  return { options, filter }
}