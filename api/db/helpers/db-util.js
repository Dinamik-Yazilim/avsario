exports.dbNull = (doc, reject) => {
  if (doc) return true
  if (reject) {
    reject('Not found')
    return false
  } else throw 'Not found'
}

exports.sendToTrash = (dbModel, collectionName, session, filter) =>
  new Promise((resolve, reject) => {
    let conn = dbModel.conn
    dbModel[collectionName]
      .findOne(filter)
      .then((doc) => {
        if (doc) {
          if (dbModel.relations) {
            let relations = dbModel.relations
            let keys = Object.keys(relations)
            let index = 0
            let errorList = []

            let kontrolEt = () => new Promise((resolve, reject) => {
              if (index >= keys.length) return resolve()
              getRepoDbModel(session.member, dbModel._id, dbModel.dbName)
                .then((mdl) => {
                  let k = keys[index]
                  let relationFilter
                  let errMessage = `Bu kayit <b>${k}</b> tablosuna baglidir.`
                  if (Array.isArray(relations[k])) {
                    if (relations[k].length > 0)
                      if (typeof relations[k][0] == 'string') {
                        relationFilter = {}
                        relationFilter[relations[k][0]] = doc._id
                        if (relations[k].length > 1)
                          if (typeof relations[k][1] == 'string')
                            errMessage = relations[k][1]
                      }
                  } else if (typeof relations[k] == 'object') {
                    if (relations[k].field) {
                      relationFilter = {}
                      relationFilter[relations[k].field] = doc._id
                      if (relations[k].filter)
                        Object.assign(relationFilter, relations[k].filter)
                      if (relations[k].message)
                        errMessage = relations[k].message
                    }
                  }

                  if (!relationFilter) {
                    relationFilter = {}
                    relationFilter[relations[k]] = doc._id
                  }

                  mdl[k]
                    .countDocuments(relationFilter)
                    .then((c) => {
                      if (c > 0) errorList.push(`${errMessage} ${c} Kayıt`)
                      index++
                      setTimeout(
                        () => kontrolEt().then(resolve).catch(reject),
                        0
                      )
                    })
                    .catch(reject)
                })
                .catch(reject)
            })

            kontrolEt()
              .then(() => {
                if (errorList.length == 0) {
                  resolve()
                } else {
                  errorList.unshift('<b>Bağlı kayıt(lar) var. Silemezsiniz!</b>')
                  reject({
                    name: 'RELATION_ERROR',
                    message: errorList.join('\n'),
                  })
                }
              })
              .catch((err) => {
                errorList.unshift('<b>Bağlı kayıt(lar) var. Silemezsiniz!</b>')
                if (err) errorList.push(err.message)
                reject({ name: 'RELATION_ERROR', message: errorList.join('\n') })
              })
          } else {
            let rubbishDoc = new dbModel.recycle({
              collectionName: collectionName,
              documentId: doc._id,
              document: doc,
              deletedBy: session.username,
              deletedById: session.member,
            })
            if (!epValidateSync(rubbishDoc, reject)) return
            rubbishDoc
              .save()
              .then(() => {
                dbModel[collectionName]
                  .deleteOne(filter)
                  .then(resolve)
                  .catch(reject)
              })
              .catch(reject)
          }
        } else {
          reject('Not found')
        }
      })
      .catch(reject)
  })

exports.epValidateSync = (doc, reject) => {
  let err = doc.validateSync()
  if (err) {
    let keys = Object.keys(err.errors)
    let errList = []
    keys.forEach((e) => errList.push(err.errors[e].message))

    reject(errList.join('\n'))
    return false
  } else {
    return true
  }
}

exports.connectionString = () => {
  const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
  } = process.env

  return `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
}