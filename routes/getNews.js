/**
 * Created by cuidong on 16-6-1.
 */
var express = require('express');
var router = express.Router();
var db = require('./../bin/dbConnect');
var credentials = require('./../bin/credentials');
var client = db.connect(credentials.mysql.name, credentials.mysql.password);

router.get("/getNews", function(req, res){
    var page = +req.query.page;
    var pageCount = +req.query.pageCount;
    //var client = db.connect(credentials.mysql.name, credentials.mysql.password);

    //先查询数据库里一共有多少条信息
    db.getNewsCount(client, function(data){
        var allCount = data;
        if(+allCount!==0){
            //说明数据库里有至少一条数据
            //查询数据库里全部数据
            db.selectNews(client, page, pageCount, function(result){
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

router.get("/showNews", function(req, res){
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
            res.render('showNews',{
                title: result[0].title
            });
        }
    });
});



// Get newList 接口
module.exports = router;
