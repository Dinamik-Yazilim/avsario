const connectorAbi = require('../../lib/connectorAbi')
module.exports = (dbModel, sessionDoc, req) =>
  new Promise(async (resolve, reject) => {

    switch (req.method.toUpperCase()) {
      case 'GET':
        getOne(dbModel, sessionDoc, req).then(resolve).catch(reject)

        break
      case 'POST':
      case 'PUT':
        if (req.params.param1 == 'connectorTest') {
          connectorTest(dbModel, sessionDoc, req).then(resolve).catch(reject)
        } else if (req.params.param1 == 'mssqlTest') {
          mssqlTest(dbModel, sessionDoc, req).then(resolve).catch(reject)
        } else {
          save(dbModel, sessionDoc, req).then(resolve).catch(reject)
        }
        break

      default:
        restError.method(req, reject)
        break
    }
  })

function getOne(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      let orgDoc = await dbModel.organizations.findOne({ _id: sessionDoc.organization })
      resolve({
        mainApp: orgDoc.mainApp,
        connector: orgDoc.connector
      })
    } catch (err) {
      reject(err)
    }
  })
}

function save(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = req.body || {}
      let orgDoc = await dbModel.organizations.findOne({ _id: sessionDoc.organization })
      console.log('data.mainApp:', data.mainApp)
      orgDoc.mainApp = data.mainApp || ''
      if (data.connector) {
        orgDoc.connector = Object.assign(orgDoc.connector || {}, data.connector)
      }

      orgDoc.save()
        .then(resolve)
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}


function connectorTest(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      const clientId = req.getValue('clientId')
      const clientPass = req.getValue('clientPass')
      if (!clientId) return reject(`clientId required`)
      if (!clientPass) return reject(`clientPass required`)
      devLog('connectorTest clientId:', clientId)
      devLog('connectorTest clientPass:', clientPass)
      connectorAbi
        .dateTime(clientId, clientPass)
        .then(resolve)
        .catch(reject)

    } catch (err) {
      reject(err)
    }
  })
}

function mssqlTest(dbModel, sessionDoc, req) {
  return new Promise(async (resolve, reject) => {
    try {
      const clientId = req.getValue('clientId')
      const clientPass = req.getValue('clientPass')

      const mssql = req.body.mssql
      if (!clientId) return reject(`clientId required`)
      if (!clientPass) return reject(`clientPass required`)
      if (!mssql) return reject(`mssql required`)
      if (!mssql.options) {
        mssql.options = { encrypt: false, trustServerCertificate: true }
      }
      const query = `SELECT name, object_id, create_date FROM sys.objects WHERE type='U' ORDER BY name`
      connectorAbi
        .mssql(clientId, clientPass, mssql, query)
        .then(resolve)
        .catch(reject)

    } catch (err) {
      reject(err)
    }
  })
}