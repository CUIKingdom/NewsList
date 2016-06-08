var express = require('express');
var router = express.Router();
var db = require('./../bin/dbConnect');
var credentials = require('./../bin/credentials');
var crypto = require("crypto");
var client = db.connect(credentials.mysql.name, credentials.mysql.password);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'NewsCrawler',
    userName: res.locals.islogin
  });
});


//login
router.route('/login')
    .get(function(req, res){
      console.log("res.locals.islogin" + res.locals.islogin );
      res.render('login', {
        title: '用户登录',
        userName: res.locals.islogin
      })
    })
    .post(function(req, res){
      //var client = db.connect(credentials.mysql.name, credentials.mysql.password);
      var result = null;
      db.selectUser(client, req.body.username, function(result){
        if(result[0] === undefined ){
          res.json({
            status: false,
            data: "抱歉，用户不存在"
          });
        }else{
          var password = ""+req.body.password;
          var md5 = crypto.createHash("md5");
          md5.update(password);
          password = md5.digest("hex");
          if(result[0].password === password){
            //user权限
            if(result[0].role === 0){
            //  说明有最高权限
              req.session.role = true;
              res.locals.role = true;
              res.cookie("role", res.locals.role, {maxAge:60000});
            }
            req.session.islogin = req.body.username;
            res.locals.islogin = req.session.islogin;
            res.cookie('islogin', res.locals.islogin, {maxAge: 60000});
            res.json({
              status: true,
              data: res.locals.islogin
            });
          }else{
            res.json({
              status: false,
              data: "抱歉，密码输入错误"
            });
          }
        }
      })
    });


//登出
router.get('/logout', function(req, res){
  res.clearCookie('islogin');
  req.session.destroy();
  res.redirect('/');
});

router.route('/register')
    .get(function(req, res){
      res.render('register', {
        //layout: "secondClear",
        title: '注册'
      })
    })
    .post(function(req, res){
      //var client = db.connect(credentials.mysql.name, credentials.mysql.password);
     //先查询是否有相同的用户名
      db.selectUser(client, req.body.username, function(result){
        if(result[0]!==undefined){
          //说明有相同的用户名存在了
          res.json({
            status: false,
            data: "用户名已存在"
          });
        }else{
          db.insertUser(client, req.body.username, req.body.password, function(err){
            if(err) console.log(err);
            res.json({
              status: true,
              data: "注册成功"
            });
          })
        }
      });
    });
module.exports = router;
