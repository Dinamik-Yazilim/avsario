module.exports = (dbModel, sessionDoc, req) =>
  new Promise(async (resolve, reject) => {

    switch (req.method.toUpperCase()) {
      case 'GET':
        if (req.params.param1 != undefined) {
          getOne(dbModel, sessionDoc, req).then(resolve).catch(reject)
        } else {
          getList(dbModel, sessionDoc, req).then(resolve).catch(reject)
        }
        break
      case 'POST':
        post(dbModel, sessionDoc, req).then(resolve).catch(reject)

        break
      case 'PUT':
        put(dbModel, sessionDoc, req).then(resolve).catch(reject)
        break
      case 'DELETE':
        deleteItem(dbModel, sessionDoc, req).then(resolve).catch(reject)
        break
      default:
        restError.method(req, reject)
        break
    }
  })

function getOne(dbModel, sessionDoc, req) {
  return new Promise((resolve, reject) => {
    dbModel.members
      .findOne({ _id: req.params.param1, organization: sessionDoc.organization })
      .then(resolve)
      .catch(reject)
  })
}

function getList(dbModel, sessionDoc, req) {
  return new Promise((resolve, reject) => {
    let options = {
      page: req.query.page || 1,
      limit: req.query.pageSize || 10,
      sort: { name: 1 }
    }
    let filter = { organization: sessionDoc.organization }
    if (req.query.passive != undefined) {
      if (req.query.passive.toString() == 'false') filter.passive = false
      if (req.query.passive.toString() == 'true') filter.passive = true
    }
    if (req.query.role) {
      filter.role = req.query.role
    }

    if (req.query.name || req.query.username || req.query.search) {
      filter.$or = [
        { username: { $regex: `.*${req.query.username || req.query.search}.*`, $options: 'i' } },
        { name: { $regex: `.*${req.query.name || req.query.search}.*`, $options: 'i' } }
      ]

    }
    dbModel.members
      .paginate(filter, options)
      .then(resolve).catch(reject)
  })
}

function post(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {

      let data = req.body || {}
      delete data._id
      if (!data.role) return reject('role required')
      if (!data.username) return reject('username required')

      if (!(data.username.includes('@') || !isNaN(data.username))) {
        return reject(`wrong username`)
      }
      if (await dbModel.members.countDocuments({ organization: sessionDoc.organization, username: data.username }) > 0)
        return reject(`username already exists`)

      data.organization = sessionDoc.organization
      const newDoc = new dbModel.members(data)

      newDoc.save()
        .then(resolve)
        .catch(reject)
    } catch (err) {
      reject(err)
    }

  })
}

function put(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {

      if (req.params.param1 == undefined) return restError.param1(req, reject)
      let data = req.body || {}
      delete data._id

      let doc = await dbModel.members.findOne({ organization: sessionDoc.organization, _id: req.params.param1 })
      if (!doc) return reject(`member not found`)

      data.organization = sessionDoc.organization
      doc = Object.assign(doc, data)

      if (await dbModel.members.countDocuments({ organization: sessionDoc.organization, username: doc.username, _id: { $ne: doc._id } }) > 0)
        return reject(`username already exists`)

      doc.save()
        .then(resolve)
        .catch(reject)
    } catch (err) {
      reject(err)
    }

  })
}

function deleteItem(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.params.param1 == undefined) return restError.param1(req, reject)
      if (sessionDoc.member == req.params.param1) return reject(`you can not delete yourself`)
      dbModel.members.removeOne(sessionDoc, { organization: sessionDoc.organization, _id: req.params.param1 })
        .then(resolve)
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}
