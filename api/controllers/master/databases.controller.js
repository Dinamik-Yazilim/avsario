const { mssql } = require('../../lib/connectorAbi')
module.exports = (dbModel, sessionDoc, req, orgDoc) =>
  new Promise(async (resolve, reject) => {

    switch (req.method.toUpperCase()) {
      case 'GET':
        getList(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        break
      case 'POST':
      case 'PUT':
        setDatabase(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        break
      default:
        restError.method(req, reject)
        break
    }
  })


function getList(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {

      const maindb = orgDoc.connector.mssql.database
      const query = `SELECT '${maindb}_' + DB_kod as db, DB_kod  as dbName, DB_isim as dbDesc FROM VERI_TABANLARI ORDER BY DB_kod`
      mssql(orgDoc.connector.clientId, orgDoc.connector.clientPass, orgDoc.connector.mssql, query)
        .then(result => {
          if (result.recordsets) {
            resolve(result.recordsets[0])
          } else {
            resolve([])
          }
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}

function setDatabase(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!req.params.param1) return reject(`param1 required`)
      sessionDoc.db = req.params.param1
      sessionDoc.save()
        .then(resolve)
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}
