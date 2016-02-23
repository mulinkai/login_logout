var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//使用express-session中间件
app.use(session({
	resave: false,
	saveUninitialized: true,
    secret: 'secret',
    cookie:{
      maxAge: 1000*60*30
    }
}));

// check login
app.use(function (req,res,next) {
	var token = req.session.token;
  	if(token) {
    	// 已登录
    	res.locals.email = req.session.email;
    	res.locals.isLogin = true;
    	next();
  	} else {
    	// 未登录
    	res.locals.isLogin = false;
    	next();
  	}
});

//使用body-parser中间件
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//首页
app.get('/',function (req,res,next) {
	res.render('index',{title: 'home'});
});

//登录
app.get('/login',function (req,res)  {
	res.render('login',{title: 'login'});
});
app.post('/login',function (req,res) {
	var email = req.body.email;
	var password = req.body.password;
	if (email == req.session.email && password == req.session.password) {
		req.session.token = true;
		res.redirect('/');
	} else {
		res.render('login', { title: 'login' });
	}
});

//注册
app.get('/signup',function (req,res) {
	res.render('signup',{title: 'signup'});
});
app.post('/signup',function (req,res) {
	var email = req.body.email;
	var password = req.body.password;
	req.session.error = '用户名创建成功！';
	req.session.email = email;
	req.session.password = password;
	res.render('login',{title: 'login'});
});

//登出
app.get('/logout',function (req,res) {
	req.session.token = false;
	res.redirect('/');
});

module.exports = app;

//启动程序
var server = http.createServer(app);
server.listen(3000, function (err) {
	console.log(' - Server start at *:3000');
});