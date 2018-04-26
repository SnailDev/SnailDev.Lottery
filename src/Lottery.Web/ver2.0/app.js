var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

var web_router = require('./web_router');
var api_router = require('./api_router');

var app = express();

// app.use(session({
//   resave: false, //添加 resave 选项  
//   saveUninitialized: true, //添加 saveUninitialized 选项  
//   secret: 'aF,.j)wBhq+E9n#aHHZ91Ba!VaoMfC', // 建议使用 128 个字符的随机字符串  
//   cookie: { maxAge: 60 * 1000 * 60 * 24}
// }));

// app.use(function (req, res, next) {
//   if (req.session.user) {  // 判断用户是否登录
//     next();
//   } else {
//     // 解析用户请求的路径
//     var arr = req.url.split('/');
//     // 去除 GET 请求路径上携带的参数
//     for (var i = 0, length = arr.length; i < length; i++) {
//       arr[i] = arr[i].split('?')[0];
//     }
//     // 判断请求路径是否为根、登录、注册、登出，如果是不做拦截
//     if (arr.length > 2 && (arr[1] == 'pk10') && (arr[2].startsWith('buy'))) {
//       req.session.originalUrl = req.originalUrl ? req.originalUrl : null;  // 记录用户原始请求路径
//       res.redirect('/login');  // 将用户重定向到登录页面
//     } else {  // 登录拦截
//       next();
//     }
//   }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', cors(), api_router);
app.use('/', web_router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
