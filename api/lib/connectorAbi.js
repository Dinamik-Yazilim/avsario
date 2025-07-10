const axios = require('axios')
exports.dateTime = function (clientId, clientPass) {
  return new Promise((resolve, reject) => {
    try {
      axios({
        url: `${process.env.CONNECTOR_API}/datetime`,
        method: 'post',
        timeout: 120 * 60 * 1000, // 120 dakika
        headers: {
          'Content-Type': 'application/json',
          clientId: clientId,
          clientPass: clientPass
        },
      })
        .then(result => {
          if (result.data.success) {
            resolve(result.data.data)
          } else {
            reject(result.data.error)
          }
        })
        .catch(err => reject(err.response.data && (err.response.data.errors || err.response.data.error) || 'error'))

    } catch (err) {
      reject(err)
    }
  })
}

exports.mssql = function (clientId, clientPass, config, query) {
  return new Promise((resolve, reject) => {
    try {
      if (config && !config.options) {
        config.options = { encrypt: false, trustServerCertificate: true }
      }
      axios({
        url: `${process.env.CONNECTOR_API}/mssql`,
        method: 'post',
        timeout: 120 * 60 * 1000, // 120 dakika
        headers: {
          'Content-Type': 'application/json',
          clientId: clientId,
          clientPass: clientPass
        },
        data: { config: config, query: query }
      })
        .then(result => {

          if (result.data.success) {
            resolve(result.data.data)
          } else {
            reject(result.data.error)
          }
        })
        .catch(err => reject(err.response && err.response.data && (err.response.data.errors || err.response.data.error) || err))

    } catch (err) {
      reject(err)
    }
  })
}