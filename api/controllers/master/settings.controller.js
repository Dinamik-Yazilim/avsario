const connectorAbi = require('../../lib/connectorAbi')
module.exports = (dbModel, sessionDoc, req, orgDoc) =>
  new Promise(async (resolve, reject) => {

    switch (req.method.toUpperCase()) {
      case 'GET':
        getOne(dbModel, sessionDoc, req).then(resolve).catch(reject)

        break
      case 'POST':
      case 'PUT':

        save(dbModel, sessionDoc, req).then(resolve).catch(reject)
        break

      default:
        restError.method(req, reject)
        break
    }
  })

function getOne(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      dbModel.settings.findOne({ organization: sessionDoc.organization, db: sessionDoc.db })
        .then(async doc => {
          if (!doc) {
            doc = new db.settings({ organization: sessionDoc.organization, db: sessionDoc.db })
            doc = await doc.save()
          }
          resolve(doc)
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}

function save(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.body || {}
      delete data._id
      delete data.organization
      delete data.db

      dbModel.settings.findOne({ organization: sessionDoc.organization, db: sessionDoc.db })
        .then(async doc => {
          if (!doc) {
            doc = new db.settings({ organization: sessionDoc.organization, db: sessionDoc.db })
          }
          doc = Object.assign(doc, data)
          doc.save()
            .then(resolve)
            .catch(reject)
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}

