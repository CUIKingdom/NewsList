/**
 * Created by cuidong on 16-6-1.
 */
var express = require('express');
var router = express.Router();
var db = require('./../bin/dbConnect');
var credentials = require('./../bin/credentials');
var client = db.connect(credentials.mysql.name, credentials.mysql.password);


router.get("/getComments", function(req, res){
    var news_id = req.query.id;
    console.log(news_id+"----------------newsId");
    //var client = db.connect(credentials.mysql.name, credentials.mysql.password);
    db.selectComments(client, ""+news_id, function(result){
        if(result[0]===undefined){
            res.json({
                status: false,
                data: "暂无数据"
            });
        }else{
            res.json({
                status: true,
                data: result
            });
        }
    })
});

router.post("/insertComment", function(req, res){
    //增加权限控制只有已登陆账号才可以进行评论
    var islogin = req.session.islogin;
    if(!islogin){
        //说明未登陆
        res.redirect("/login");
    }

    var news_id = req.body.news_id;
    var comment = req.body.comment;
    var user_id = req.body.user_id;
    //var client = db.connect(credentials.mysql.name, credentials.mysql.password);
    db.insertComments(client,news_id,user_id, comment, function(result){
        var status = result.insertId;
        if(status!==undefined){
            //说明插入成功
            res.json({
                status: true
            });
        }else{
            res.json({
                status: false
            });
        }
    })
});

// Get newList 接口
module.exports = router;