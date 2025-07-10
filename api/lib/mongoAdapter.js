// const ObjectId = require('mongodb')
// export const defaultCollections = {
//     Users: "users",
//     Accounts: "accounts",
//     Sessions: "sessions",
//     VerificationTokens: "verification_tokens",
// }

function from(object) {
  const newObject = {}
  for (const key in object) {
    const value = object[key]
    if (key === "_id") {
      newObject.id = value.toHexString()
    }
    else if (key === "userId") {
      newObject[key] = value.toHexString()
    }
    else {
      newObject[key] = value
    }
  }
  return newObject
}

function to(object) {
  const newObject = {
    _id: new ObjectId(object.id),
  }
  for (const key in object) {
    const value = object[key]
    if (key === "userId")
      newObject[key] = _id(value)
    else if (key === "id")
      continue
    else
      newObject[key] = value
  }
  return newObject
}


const createUser = (req) => new Promise((resolve, reject) => {
  const user = to(req.body)
  db.users
    .insertOne(user)
    .then(userDoc => resolve(from(userDoc)))
    .catch(reject)
})
const getUser = (req) => new Promise((resolve, reject) => {
  db.users
    .findOne({ _id: req.getValue('id') || req.getValue('_id') })
    .then(userDoc => {
      if (userDoc) {
        resolve(from(userDoc))
      } else resolve()
    })
    .catch(reject)
})

const getUserByEmail = (req) => new Promise((resolve, reject) => {
  db.users
    .findOne({ email: req.getValue('email') })
    .then(userDoc => {
      if (userDoc) {
        resolve(from(userDoc))
      } else resolve()
    })
    .catch(reject)
})

const getUserByAccount = (req) => new Promise((resolve, reject) => {
  db.users_accounts
    .findOne({ provider: req.getValue('provider'), providerAccountId: req.getValue('providerAccountId') })
    .then(accountDoc => {
      if (!accountDoc)
        return resolve()
      db.users
        .findOne({ _id: accountDoc.userId })
        .then(userDoc => {
          if (userDoc) {
            resolve(from(userDoc))
          } else resolve()
        })
        .catch(reject)
    })
    .catch(reject)
})

const updateUser = (req) => new Promise((resolve, reject) => {
  const { _id, ...user } = to(req.body)
  db.users
    .findOneAndUpdate({ _id }, { $set: user }, { returnDocument: "after" })
    .then(userDoc => {
      if (userDoc) {
        resolve(from(userDoc))
      } else resolve()
    })
    .catch(reject)
})

const deleteUser = (req) => new Promise((resolve, reject) => {
  const userId = req.getValue('userId') || req.getValue('id') || req.getValue('_id')
  Promise
    .all([
      db.users_accounts.deleteMany({ userId: userId }),
      db.users_sessions.deleteMany({ userId: userId }),
      db.users.deleteOne({ _id: userId }),
    ])
    .then(value => resolve(value))
    .catch(reject)

})

const linkAccount = (req) => new Promise((resolve, reject) => {
  const account = to(req.body)

})

exports.MongoDBAdapter = async () => {

  return {

    linkAccount: async (data) => {
      const account = to(data)
      await db.users_accounts.insertOne(account)
      return account
    },
    async unlinkAccount(provider_providerAccountId) {
      const account = await db.users_accounts.findOneAndDelete(provider_providerAccountId)
      return from(account)
    },
    async getSessionAndUser(sessionToken) {
      const session = await db.users_sessions.findOne({ sessionToken })
      if (!session)
        return null
      const user = await db.users.findOne({ _id: new ObjectId(session.userId) })
      if (!user)
        return null
      return {
        user: from(user),
        session: from(session),
      }
    },
    async createSession(data) {
      const session = to(data)
      await db.users_sessions.insertOne(session)
      return from(session)
    },
    async updateSession(data) {
      const { _id, ...session } = to(data)
      const updatedSession = await db.users_sessions.findOneAndUpdate({ sessionToken: session.sessionToken }, { $set: session }, { returnDocument: "after" })
      return from(updatedSession)
    },
    async deleteSession(sessionToken) {
      const session = await db.users_sessions.findOneAndDelete({
        sessionToken,
      })
      return from(session)
    },
    async createVerificationToken(data) {
      await db.users_verificationTokens.insertOne(to(data))
      return data
    },
    async useVerificationToken(identifier_token) {
      const verificationToken = await db.users_verificationTokens.findOneAndDelete(identifier_token)
      if (!verificationToken)
        return null
      const { _id, ...rest } = verificationToken
      return rest
    },
  }
}

// module.exports = {
//     from, to, _id, MongoDBAdapter
// }
