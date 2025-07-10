exports.socketSend = (sessionDoc, data) => {
  db.webSockets.find({ session: sessionDoc._id, connected: true, member: sessionDoc.member })
    .then(docs => {
      docs.forEach(e => {
        if (global.wss.socketListByUuid[e.socketId]) {
          global.wss.socketListByUuid[e.socketId].send(JSON.stringify(data))
        }
      })
    })
    .catch(errorLog)
}