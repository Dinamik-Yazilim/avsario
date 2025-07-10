module.exports = (dbModel, sessionDoc, req, orgDoc) =>
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
    dbModel.storePosComputers
      .findOne({ _id: req.params.param1, organization: sessionDoc.organization, db: sessionDoc.db })
      .populate([{
        path: 'store',
        select: '_id name'
      }])
      .then(resolve)
      .catch(reject)
  })
}

function getList(dbModel, sessionDoc, req) {
  return new Promise((resolve, reject) => {
    let options = {
      page: req.query.page || 1,
      limit: req.query.pageSize || 10,
      sort: { name: 1 },
      populate: [{
        path: 'store',
        select: '_id name'
      }]
    }
    let filter = { organization: sessionDoc.organization, db: sessionDoc.db }
    if (req.query.passive != undefined) {
      if (req.query.passive.toString() == 'false') filter.passive = false
      if (req.query.passive.toString() == 'true') filter.passive = true
    }
    if (req.query.store) {
      filter.store = req.query.store
    }
    if (req.query.name || req.query.username || req.query.search) {
      filter.$or = [
        { name: { $regex: `.*${req.query.name || req.query.search}.*`, $options: 'i' } }
      ]

    }
    dbModel.storePosComputers
      .paginate(filter, options)
      .then(resolve).catch(reject)
  })
}

function post(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {

      let data = req.body || {}
      delete data._id
      if (!data.store) return reject('store required')
      if (!data.name) return reject('name required')
      console.log(`data.store`, data.store)
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: data.store })
      if (!storeDoc) return reject(`store not found`)

      if (await dbModel.storePosComputers.countDocuments({ organization: sessionDoc.organization, db: sessionDoc.db, store: storeDoc._id, name: data.name }) > 0)
        return reject(`name already exists`)

      data.organization = sessionDoc.organization
      data.db = sessionDoc.db
      data.store = storeDoc._id
      const newDoc = new dbModel.storePosComputers(data)

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

      let doc = await dbModel.storePosComputers.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!doc) return reject(`pos computer not found`)

      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: doc.store })
      if (!storeDoc) return reject(`store not found`)

      data.organization = sessionDoc.organization
      data.db = sessionDoc.db
      data.store = storeDoc._id

      doc = Object.assign(doc, data)

      if (await dbModel.storePosComputers.countDocuments({ organization: sessionDoc.organization, db: doc.db, store: storeDoc._id, name: doc.name, _id: { $ne: doc._id } }) > 0)
        return reject(`name already exists`)

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
      dbModel.storePosComputers.removeOne(sessionDoc, { organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
        .then(resolve)
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}
