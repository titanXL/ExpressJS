let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let exphbs = require('express-handlebars')
let expressValidator = require('express-validator')
let flash = require('connect-flash')
let session = require('express-session')
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let mongo = require('mongodb')
let mongoose = require('mongoose')
let async = require('async')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/elearn')
let db = mongoose.connection

let routes = require('./routes/index')
let users = require('./routes/users')
let classes = require('./routes/classes')
let students = require('./routes/students')
let instructors = require('./routes/instructors')

let app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.engine('handlebars', exphbs({defaultLayout: 'layout'}))
app.set('view engine', 'handlebars')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    let namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

app.use(flash())
// Global vars
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  if (req.url === '/') {
    res.locals.isHome = true
  }
  next()
})

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null
  if (req.user) {
    res.locals.type = req.user.type
  }
  next()
})

app.use('/', routes)
app.use('/users', users)
app.use('/classes', classes)
app.use('/students', students)
app.use('/instructors', instructors)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
