const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const routes = require('./routes')

const app = new express()
routes(app)

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); 
app.use(express.static(path.join(__dirname, 'public'))) // 静态资源路径

// view engine set
app.set('views', path.join(__dirname, 'views'))
app.engine('.html', ejs.__express)
app.set('view engine', 'html')
// 请求参数解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(logger('dev'));
app.use(cookieParser())

app.listen(3000, () => {
  console.log('app listening at http://localhost:3000')
})