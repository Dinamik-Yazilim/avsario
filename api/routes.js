const packageJson = require('./package.json')
const auth = require('./lib/auth')
const spamCheck = require('./lib/spam-detector')

module.exports = (app) => {
  app.all('/*', (req, res, next) => {
    req.IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || ''
    req.getValue = (key) => {
      let val = (req.headers[key] || req.body[key] || req.query[key] || '')
      if (typeof val === 'string') val = val.trim()
      return val
    }

    next()
  })

  const apiWelcomeMessage = {
    message: process.env.RESTAPI_WELCOME,
    status: process.env.NODE_ENV || ''
  }


  app.all('/api', function (req, res) {
    res.status(200).json({ success: true, data: apiWelcomeMessage })
  })

  app.all('/api/v1', function (req, res) {
    res.status(200).json({ success: true, data: apiWelcomeMessage })
  })
  app.all('/', function (req, res) {
    res.status(200).json({ success: true, data: apiWelcomeMessage })
  })

  authControllers(app, '/api/v1/auth/:func/:param1/:param2/:param3')
  masterControllers(app, '/api/v1/:func/:param1/:param2/:param3')


  app.use((req, res, next) => {
    res.status(404).json({ success: false, error: `function not found. ${req.originalUrl}` })
  })

  app.use((err, req, res, next) => {
    sendError(err, req, res)
  })
}

function authControllers(app, route) {
  setRoutes(app, route, (req, res, next) => {
    const ctl = getController('/auth', req.params.func)
    let spam = spamCheck(req.IP)
    if (!spam) {
      if (ctl) {
        ctl(req)
          .then((data) => {
            console.log('data:', data)
            if (data == undefined) res.json({ success: true })
            else if (data == null) res.json({ success: true })
            else {
              res.status(200).json({
                success: true,
                data: data,
              })
            }
          })
          .catch(next)
      } else next()
    } else {
      next(`Suspicious login attempts. Try again after ${spam} seconds.`)
    }
  })
}


function masterControllers(app, route) {
  setRoutes(app, route, (req, res, next) => {
    try {

      const ctl = getController('/master', req.params.func)
      if (ctl) {
        passport(req)
          .then(async (sessionDoc) => {
            const orgDoc = await db.organizations.findOne({ _id: sessionDoc.organization })
            ctl(db, sessionDoc, req, orgDoc)
              .then((data) => {
                if (data == undefined) res.json({ success: true })
                else if (data == null) res.json({ success: true })
                else {
                  res.status(200).json({ success: true, data: data })
                }
              })
              .catch(next)
          })
          .catch((err) => {
            res.status(401).json({ success: false, error: err })
          })
      } else next()
    } catch (err) {
      next(err)
    }

  })
}

function sendError(err, req, res) {
  let errorMessage = 'Error'
  let statusCode = 400
  if (typeof err == 'string') {
    errorMessage = err
  } else {
    if (err.message) errorMessage = err.message
  }
  let response = { success: false, error: errorMessage }

  if (errorMessage.toLowerCase().includes('not found')) {
    statusCode = 404
  }
  else if (process.env.ERROR_DOCUMENTATION_URI && req.route) {
    let baseUrl = req.route.path.split('/:func')[0]
    let func = req.url
      .substring(baseUrl.length + 1)
      .split('?')[0]
      .split('/')[0]
    response.docUrl = `${process.env.ERROR_DOCUMENTATION_URI}?func=${func}`
  }
  res.status(statusCode).json(response)
}

global.setRoutes = (app, route, cb1, cb2) => {
  let dizi = route.split('/:')
  let yol = ''
  dizi.forEach((e, index) => {
    if (index > 0) {
      yol += `/:${e}`
      if (cb1 != undefined && cb2 == undefined) {
        app.all(yol, cb1)
      } else if (cb1 != undefined && cb2 != undefined) {
        app.all(yol, cb1, cb2)
      }
    } else {
      yol += e
    }
  })
}

function getController(pathName, funcName) {

  let controllerName = path.join(__dirname, `controllers`, `${pathName}`, `${funcName}.controller.js`)
  if (fs.existsSync(controllerName) == false) {
    return false
  } else {
    return require(controllerName)
  }
}

function passport(req) {
  return new Promise((resolve, reject) => {
    let token = req.getValue('token')
    if (token) {
      token = token.split('DINAMIKUP_')[1]
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
                  sessionDoc.lastOnline = new Date()
                  sessionDoc.lastIP = req.IP
                  sessionDoc.save()
                    .then(resolve)
                    .catch(reject)

                }
              } else {
                reject('session not found. login again.')
              }
            })
            .catch(reject)
        })
        .catch(reject)
    } else {
      reject('authorization failed. token is empty.')
    }
  })
}


global.getSessionMember = (sessionDoc) => new Promise((resolve, reject) => {
  db.members.findOne({ _id: sessionDoc.member })
    .then(memberDoc => {
      if (memberDoc) {
        resolve(memberDoc)
      } else {
        reject('kullanıcı bulunamadı')
      }
    })
    .catch(reject)
})

global.restError = {
  param1: function (req, next) {
    next(`:[/${req.params.func}] [/:param1] gereklidir`)
  },
  param2: function (req, next) {
    next(
      `:[/${req.params.func}/${req.params.param1}] [/:param2] gereklidir`
    )
  },
  method: function (req, next) {
    next(`:${req.params.func} Hatalı method: ${req.method}`)
  },
  session: function (req, next) {
    next(`Bu işlem için yetkiniz yok`)
  },
  auth: function (req, next) {
    next(`Bu işlem için yetkiniz yok`)
  },
  data: function (req, next, field) {
    if (field) {
      next(`'${field}' Hatalı veya eksik veri`)
    } else {
      next(`Hatalı veya eksik veri`)
    }
  },
}
