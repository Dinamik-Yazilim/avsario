
var createError = require('http-errors')
var express = require('express')
var bodyParser = require('body-parser')
var logger = require('morgan')
var favicon = require('serve-favicon')
var methodOverride = require('method-override')
var cookieParser = require('cookie-parser')
var app = express()
var cors = require('cors')
// const { ExpressAuth } = require('@auth/express')
// const Google = require('@auth/express/providers/google')
// const Yandex = require('@auth/express/providers/yandex')

module.exports = () => new Promise(async (resolve, reject) => {
  app.use(cors())
  app.use(favicon(path.join(__root, '/public/favicon.ico')))

  process.env.NODE_ENV === 'development' && app.use(logger('dev'))

  app.use(bodyParser.json({ limit: "500mb" }))
  app.use(bodyParser.urlencoded({ limit: "500mb", extended: true, parameterLimit: 50000 }))

  app.use(cookieParser())
  app.use(methodOverride())

  app.set('port', process.env.HTTP_PORT)

  app.use('/', express.static(path.join(__root, '/public')))

  global.t = require('./lib/i18n').t
  global.getSearchParams = require('./lib/searchHelper').getSearchParams

  require('./routes')(app)
  resolve(app)
  eventLog(`[RestAPI]`.cyan, 'started')

})
