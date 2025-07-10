const pos312 = require('../../posProviders/pos312/pos312Helper')
const axios = require('axios')
module.exports = (dbModel, sessionDoc, req, orgDoc) =>
  new Promise(async (resolve, reject) => {

    switch (req.method.toUpperCase()) {
      // case 'GET':
      //   if (req.params.param1 != undefined) {
      //     getOne(dbModel, sessionDoc, req).then(resolve).catch(reject)
      //   } else {
      //     getList(dbModel, sessionDoc, req).then(resolve).catch(reject)
      //   }
      //   break
      case 'POST':

        if (!req.params.param1) return reject(`param1 required`)

        if (req.params.param2 == 'test') {
          test(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        } else if (req.params.param2 == 'syncPriceTrigger') {
          syncPriceTrigger(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        } else if (req.params.param2 == 'syncReset') {
          syncReset(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        } else if (req.params.param2 == 'syncItems') {
          syncItems(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        } else if (req.params.param2 == 'syncFirms') {
          syncFirms(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        } else if (req.params.param2 == 'syncSales') {
          syncSales(dbModel, sessionDoc, req, orgDoc).then(resolve).catch(reject)
        } else {
          return reject(`param2 required`)
        }


        break

      default:
        restError.method(req, reject)
        break
    }
  })

function test(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const integrationType = req.getValue('integrationType')
      const webServiceUrl = req.getValue('webServiceUrl') || req.getValue('url')
      const webServiceUsername = req.getValue('webServiceUsername') || req.getValue('username')
      const webServicePassword = req.getValue('webServicePassword') || req.getValue('password')

      if (!webServiceUrl) return reject(`web`)
      switch (integrationType) {
        case 'pos312':
          pos312.test(webServiceUrl, webServiceUsername, webServicePassword).then(resolve).catch(reject)

          break
        default:
          return reject('integration type not supported yet')
      }

    } catch (err) {
      reject(err)
    }
  })
}

function syncPriceTrigger(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!storeDoc) return reject('store not found')
      switch (storeDoc.posIntegration.integrationType) {
        case 'pos312':
          pos312.syncPriceTrigger_pos312(dbModel, sessionDoc, req, orgDoc, storeDoc).then(resolve).catch(reject)
          break
        default:
          reject('integration type not supported yet')
          break
      }
    } catch (err) {
      reject(err)
    }

  })
}
function syncReset(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!storeDoc) return reject('store not found')
      // storeDoc.posIntegration.lastUpdate_barcodes = ''
      storeDoc.posIntegration.lastUpdate_firms = ''
      storeDoc.posIntegration.lastUpdate_items = ''
      // storeDoc.posIntegration.lastUpdate_prices = ''
      storeDoc.save()
        .then(() => resolve())
        .catch(reject)
    } catch (err) {
      reject(err)
    }

  })
}

function syncFirms(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!storeDoc) return reject('store not found')
      switch (storeDoc.posIntegration.integrationType) {
        case 'pos312':
          pos312.syncFirms_pos312(dbModel, sessionDoc, req, orgDoc, storeDoc).then(resolve).catch(reject)
          break
        default:
          reject('integration type not supported yet')
          break
      }
    } catch (err) {
      reject(err)
    }

  })
}

function syncItems(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!storeDoc) return reject('store not found')
      switch (storeDoc.posIntegration.integrationType) {
        case 'pos312':
          pos312.syncItems_pos312(dbModel, sessionDoc, req, orgDoc, storeDoc).then(resolve).catch(reject)
          break
        default:
          reject('integration type not supported yet')
          break
      }
    } catch (err) {
      reject(err)
    }

  })
}

function syncSales(dbModel, sessionDoc, req, orgDoc) {
  return new Promise(async (resolve, reject) => {
    try {
      const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
      if (!storeDoc) return reject('store not found')
      switch (storeDoc.posIntegration.integrationType) {
        case 'pos312':
          pos312.syncSales_pos312(dbModel, sessionDoc, req, orgDoc, storeDoc).then(resolve).catch(reject)
          break
        default:
          reject('integration type not supported yet')
          break
      }
    } catch (err) {
      reject(err)
    }

  })
}

// function syncBarcodes(dbModel, sessionDoc, req, orgDoc) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
//       if (!storeDoc) return reject('store not found')
//       switch (storeDoc.posIntegration.integrationType) {
//         case 'pos312':
//           pos312.syncBarcodes_pos312(dbModel, sessionDoc, req, orgDoc, storeDoc).then(resolve).catch(reject)
//           break
//         default:
//           reject('integration type not supported yet')
//           break
//       }
//     } catch (err) {
//       reject(err)
//     }

//   })
// }

// function syncPrices(dbModel, sessionDoc, req, orgDoc) {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const storeDoc = await db.stores.findOne({ organization: sessionDoc.organization, db: sessionDoc.db, _id: req.params.param1 })
//       if (!storeDoc) return reject('store not found')
//       switch (storeDoc.posIntegration.integrationType) {
//         case 'pos312':
//           pos312.syncPrices_pos312(dbModel, sessionDoc, req, orgDoc, storeDoc).then(resolve).catch(reject)
//           break
//         default:
//           reject('integration type not supported yet')
//           break
//       }
//     } catch (err) {
//       reject(err)
//     }

//   })
// }