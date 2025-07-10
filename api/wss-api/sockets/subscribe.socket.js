const auth = require('../../lib/auth')
module.exports = async (socket, data) => {
  try {
    tokenToSessionDoc(data.token)
      .then(sessionDoc => {
        socket.subscribed = true
        socket.sessionId = sessionDoc._id
        let wsDoc = new db.webSockets({
          socketId: socket.id,
          session: sessionDoc._id,
          member: sessionDoc.member,
          role: sessionDoc.role,
          connected: true,
          lastIP: sessionDoc.lastIP
        })
        wsDoc.save()
          .then(wsDoc => {
            socket.sendSuccess('subscribed', { uuid: socket.id, message: 'Subscription was successful' })
            devLog(`[wss] subscribed`.green, wsDoc)
          })
          .catch(err => {
            errorLog(`[WSS Subscribe]`.cyan, err)
            socket.sendError(err)
          })


      })
      .catch(err => {
        errorLog(`[Subscribe]`.cyan, err)
        socket.sendError(err)
      })




  } catch (err) {
    errorLog(`[Subscribe]`.cyan, err)
    socket.sendError(err)
  }

}

function tokenToSessionDoc(dataToken) {

  return new Promise((resolve, reject) => {
    let token = dataToken.split('DINAMIKUP_')[1]
    auth
      .verify(token)
      .then((decoded) => {
        db.sessions
          .findOne({ _id: decoded.sessionId })
          .then((sessionDoc) => {

            if (sessionDoc) {
              if (sessionDoc.closed) {
                reject('session closed')
              } else {
                resolve(sessionDoc)
                // sessionDoc.lastOnline = new Date()
                // sessionDoc.lastIP = req.IP
                // sessionDoc.save()
                //   .then(resolve)
                //   .catch(reject)

              }
            } else {
              reject('session not found. login again.')
            }
          })
          .catch(reject)
      })
      .catch(reject)
  })
}