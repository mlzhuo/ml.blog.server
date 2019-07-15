const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
global.JWT_KEY = 'ML.BLOG.SERVER'

const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const MESSAGE = require('./constant/message')
const { ApiResponse, GetToken } = require('./utils/apiUtils')

const app = express()

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Content-Type', 'application/json;charset=utf-8')
  if (req.method == 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
  if (
    req.path === '/api/login' ||
    req.path === '/api/register' ||
    req.path.startsWith('/public')
  ) {
    next()
    return
  }
  const token = GetToken(req)
  if (token) {
    jwt.verify(token, global.JWT_KEY, function(err, decoded) {
      if (err) {
        return res
          .status(403)
          .send(ApiResponse({ state: false, message: MESSAGE.INVALID_TOKEN }))
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res
      .status(403)
      .send(ApiResponse({ state: false, message: MESSAGE.INVALID_TOKEN }))
  }
})

app.use('/public', express.static(__dirname + '/public'))
app.use('/api', indexRouter)
app.use('/api/user', userRouter)
app.use('/api/blog', blogRouter)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({
    state: false,
    message: err.message,
    error: err
  })
})

module.exports = app
