const fs = require('fs')
const path = require('path')

const { mssql } = require('../connectorAbi')
exports.getDbList = function (connector) {
  return new Promise(async (resolve, reject) => {
    try {
      const maindb = connector.mssql.database
      const query = `SELECT '${maindb}_' + DB_kod as db, DB_kod  as dbName, DB_isim as dbDesc FROM VERI_TABANLARI ORDER BY DB_kod`
      mssql(connector.clientId, connector.clientPass, connector.mssql, query)
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


exports.getList = function (sessionDoc, orgDoc, listQuery, dbSuffix = '') {
  return new Promise(async (resolve, reject) => {
    try {
      let query = `use ${sessionDoc.db}${dbSuffix};
      ${listQuery || ''}
      `
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

exports.getListDb = function (orgDoc, db, listQuery) {
  return new Promise(async (resolve, reject) => {
    try {
      let query = `use ${db};
      ${listQuery || ''}
      `
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

exports.executeSql = function (sessionDoc, orgDoc, execQuery, dbSuffix = '') {
  return new Promise(async (resolve, reject) => {
    try {
      let query = `use ${sessionDoc.db}${dbSuffix};
      BEGIN TRY
        BEGIN TRAN;
          ${execQuery || ''}
        COMMIT TRAN;
      END TRY
      BEGIN CATCH
        
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;
        
        SELECT 
          @ErrorMessage = ERROR_MESSAGE(),
          @ErrorSeverity = ERROR_SEVERITY(),
          @ErrorState = ERROR_STATE();
        
        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
      END CATCH
      `
      mssql(orgDoc.connector.clientId, orgDoc.connector.clientPass, orgDoc.connector.mssql, query)
        .then(result => {
          resolve({ rowsAffected: (result.rowsAffected || []).reduce((a, b) => a + b, 0) })
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}

exports.executeSqlDb = function (orgDoc, db, execQuery) {
  return new Promise(async (resolve, reject) => {
    try {
      // let query = `use ${db};
      //   ${execQuery || ''}
      // `
      let query = `use ${db};
      BEGIN TRY
        BEGIN TRAN;
          ${execQuery || ''}
        COMMIT TRAN;
      END TRY
      BEGIN CATCH
        
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT 
          @ErrorMessage = ERROR_MESSAGE(),
          @ErrorSeverity = ERROR_SEVERITY(),
          @ErrorState = ERROR_STATE();

        IF @@TRANCOUNT > 0 ROLLBACK TRAN;
        
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
      END CATCH
      `
      fs.writeFileSync(path.join(__dirname, 'executeSqlDb.txt'), query, 'utf8')
      mssql(orgDoc.connector.clientId, orgDoc.connector.clientPass, orgDoc.connector.mssql, query)
        .then(result => {
          resolve({ rowsAffected: (result.rowsAffected || []).reduce((a, b) => a + b, 0) })
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}
