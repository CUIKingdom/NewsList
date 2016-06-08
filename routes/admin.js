/**
 * Created by cuidong on 16-6-2.
 */
var express = require('express');
var router = express.Router();
var db = require('./../bin/dbConnect');
var credentials = require('./../bin/credentials');
var crypto = require("crypto");
var client = db.connect(credentials.mysql.name, credentials.mysql.password);

//中间件 判断权限
router.use(function(req, res, next){
    var role = req.session.role;
    if(role){
        //说明有后台管理权限
        next();
    }else{
        res.redirect("../");
    }
});

router.get("/index", function(req,res){
    res.render("./admin/index", {
        layout: "mainAdmin",
        title: "NewsCrawler Manager"
    })
});

router.get("/addNews", function(req,res){
   res.render("./admin/addNews", {
       layout: "mainAdmin",
       title: "NewsCrawler Manager"
   })
});

router.get("/editNews", function(req,res){
    var id = req.query.id;
    res.locals.id = id;
    //var client = db.connect(credentials.mysql.name, credentials.mysql.password);
    db.getOneNews(client, id, function(result){
        if(result[0]===undefined){
            res.locals.status = false;
            res.locals.data = "暂无数据";
        }else{
            res.locals.status = true;
            res.locals.data = result[0];
            res.render("./admin/editNews", {
                layout: "mainAdmin",
                title: "NewsCrawler Manager"
            })
        }
    });
});

router.get("/deleteNews", function(req,res){
    var news_id = req.query.id;
    //var client = db.connect(credentials.mysql.name, credentials.mysql.password);
    db.deleteOneNews(client, news_id, function(result){
        if(+result.affectedRows===1){
            res.json({
                status: true
            })
        }else{
            res.json({
                status: false
            });
        }
    });
});

router.post("/updateNews", function(req, res){
    var data = req.body;
    var params={};
    for(var i in data){
        params[data[i].name] = data[i].value || undefined;
    }
    console.log("news_id-------------");
    console.log(params.news_id);
    //判断是否是新增的新闻
    if(params.news_id===undefined){
        console.log("运行 新增新闻");
        //说明新增新闻
        var md5 = crypto.createHash("md5");
        var time = new Date();
        time = time.toLocaleString();
        var news_id = time + params.title;
        md5.update(news_id);
        params.news_id = md5.digest("hex");
        //var client = db.connect(credentials.mysql.name, credentials.mysql.password);
        db.insertOneNews(client, params.news_id, params.title, params.author, params.date, params.content,
            params.source, params.link ,function(result){
                if(result){
                    res.json({
                        status: true
                    })
                }else{
                    res.json({
                        status: false
                    })
                }
            });
    }else{
        //更新 news
        //var client = db.connect(credentials.mysql.name, credentials.mysql.password);
        db.updateOneNews(client, params.news_id, params.title, params.author, params.date, params.content,
            params.source, params.link ,function(result){
                if(result){
                    res.json({
                        status: true
                    })
                }else{
                    res.json({
                        status: false
                    })
                }
            });
    }
});


router.get("/comments", function(req,res){
    res.render("./admin/comments", {
        layout: "mainAdmin",
        title: "NewsCrawler Manager"
    })
});

router.get("/adminGetComment", function(req, res){
    //组合格式： title \ comment \ userName
    var page = +req.query.page;
    var pageCount = +req.query.pageCount;
    //var client = db.connect(credentials.mysql.name, credentials.mysql.password);

    //先查询数据库里一共有多少条信息
    db.getCommentsCount(client, function(data){
        var allCount = data;
        if(+allCount!==0){
            //说明数据库里有至少一条数据
            //查询数据库里全部数据
            db.selectAdminComments(client, page, pageCount, function(result){
                //返回数据
                res.json({
                    status: true,
                    allCount: allCount,
                    data: result
                });
            });
        }else{
            res.json({
                status: false,
                data: "暂无数据"
            });
        }
    });
});


router.get("/deleteComments", function(req,res){
    var comment_id = req.query.id;
    //var client = db.connect(credentials.mysql.name, credentials.mysql.password);
    db.deleteComments(client, comment_id, function(result){
        if(+result.affectedRows===1){
            res.json({
                status: true
            })
        }else{
            res.json({
                status: false
            });
        }
    });
});

module.exports = router;
