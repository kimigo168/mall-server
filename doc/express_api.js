// 1 express four methods
// express.json()
// express.static(root, [options])
// express.Router(options);
// express.urlencoded(options)
var options = {
  dotfiles: 'ignore', // 如何处理以.开头的文件或目录
  etag: false, // 启用或禁用etag
  extensions: ['htm', 'html'], // 设置文件扩展名回退，找不到搜索指定数组中
  index: false, // 发送指定的目录索引文件。设置为false以禁用目录索引。
  lastModified: true, // 将Last-Modified标题设置为操作系统上文件的最后修改日期。
  maxAge: '1d', // 以毫秒为单位设置Cache-Control标头的max-age属性或以ms格式设置字符串。
  redirect: false, // 当路径名称是目录时，重定向到尾随“/”。
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}
app.use(express.static('public', options))

var express = require('express')
var https = require('https')
var http = require('http')
var app = express()

http.createServer(app).listen(80)
https.createServer(options, app).listen(443)

// req.body
var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/profile', upload.array(), function (req, res, next) {
  console.log(req.body);
  res.json(req.body);
});

res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });