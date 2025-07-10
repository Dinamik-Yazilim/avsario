const WebSocketServer = require('ws').WebSocketServer
const url = require('url')
const uuid = require('uuid')

global.wss = null



module.exports = async function (httpServer) {

  const moduleHolder = await util.moduleLoader(path.join(__dirname, 'sockets'), '.socket.js')

  return new Promise(async (resolve, reject) => {

    global.wss = new WebSocketServer({
      server: httpServer,
      autoAcceptConnections: true,
      path: '/',
      host: '*'
    })
    global.wss.socketListByUuid = {}

    wss.on('connection', (socket, req) => {

      socket.ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || socket.conn.remoteAddress || '').split(',')[0].trim()
      socket.isAlive = true
      socket.lastPong = new Date()
      socket.id = uuid.v4()
      // socket.pathname = url.URL.parse(req.url).pathname
      socket.subscribed = false
      socket.sendError = sendError
      socket.sendSuccess = sendSuccess
      global.wss.socketListByUuid[socket.id] = socket
      socket.sessionId = ''
      socket.callbackList = {}


      // socket.pingIntervalId = setInterval(() => {
      //   socket.ping()
      //   devLog(socket.connector.clientId, ' ping gonderildi')
      // }, Number(process.env.CONNECTOR_WS_PING_INTERVAL || 30000))
      // socket.on('pong', () => {
      //   socket.isAlive = true
      //   socket.lastPong = new Date()
      //   if (moduleHolder.pong) moduleHolder.pong(socket)
      // })

      socket.on('message', (rawData) => {
        try {
          let data = JSON.parse(rawData.toString())

          if (data.callback && socket.callbackList[data.callback]) {
            socket.callbackList[data.callback](data)
          } else {
            if (data.event && moduleHolder[data.event]) {
              moduleHolder[data.event](socket, data)
            } else {
              errorLog('[WssAPI]'.cyan, 'Unknown Wss function:', data.event.green)
            }
          }
        } catch (err) {
          errorLog('[WssAPI]'.cyan, err.name, err.message)
        }
      })

      socket.on('error', (err) => {
        errorLog('[WssAPI]'.cyan, err.name, err.message)
      })

      socket.on('close', () => {
        delete global.wss.socketListByUuid[socket.id]
        devLog('Disconnected socket.id', socket.id)
        purgeSocket(socket)
        eventLog(`Total client:`, wss._server._connections)
      })

      devLog('Connected', socket.ip, socket.id)
      eventLog(`Total client:`, wss._server._connections)
    })


    eventLog(`[WebsocketAPI]`.cyan, 'started')
    // uyuyanlariGemidenAt()
    resolve()
  })
}

global.purgeSocket = (socket) => {
  try {
    const socketId = socket.id
    delete global.wss.socketListByUuid[socketId]
    //clearInterval(socket.pingIntervalId)
    socket.terminate()
    db.webSockets.updateMany({ socketId: socketId }, { $set: { connected: false } }, { multi: true })
  } catch (err) {
    console.error(err)
  }
}

// throw the sleepers out of the boat

// function uyuyanlariGemidenAt() {
//   if (global.wss) {
//     let gemidenAtildi = false
//     global.wss.clients.forEach((socket) => {
//       if (socket.isAlive === false) {
//         purgeSocket(socket)
//         gemidenAtildi = true
//       } else {
//         socket.isAlive = false
//         socket.ping()
//       }
//     })


//     gemidenAtildi && eventLog(`Total client:`, wss._server._connections)
//   }

//   setTimeout(() => {
//     uyuyanlariGemidenAt()
//   }, Number(process.env.CONNECTOR_WS_PING_INTERVAL || 30000))
// }


function sendError(err, callback) {
  let socket = this
  let error = { name: 'Error', message: '' }
  if (typeof err == 'string') {
    error.message = err
  } else {
    error.name = err.name || 'Error'
    if (err.message)
      error.message = err.message
    else
      error.message = err.name || ''
  }

  let obj = {
    event: callback || 'error',
    success: false,
    error: error
  }
  devError(`[SendError]`.cyan, JSON.stringify(obj))
  socket.send(JSON.stringify(obj))
}

function sendSuccess(event, data, callback) {
  let socket = this
  let obj = {
    event: event,
    success: true,
    data: data
  }
  if (callback) {
    obj.callback = callback
  }
  devLog(`[SendSuccess]`.cyan, JSON.stringify(obj))
  socket.send(JSON.stringify(obj))
}
