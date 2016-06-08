/**
 * Created by cuidong on 16-5-31.
 */
var mysql = require('mysql');
var crypto = require("crypto");

function connectServer(user, password){
    var client = mysql.createConnection({
        host: 'localhost',
        user: user,
        password: password,
        database: 'news_crawler'
    });
    return client;
}

function selectUser(client, username, callback){
    //client为一个 mysql 链接对象
    client.query('select * from news_crawler.users where username = "'+username+'"', function(err, results, fields){
        if(err) throw err;
        callback(results);
    });
}


function insertUser(client, username, password, callback){
    var psd = password;
    var md5 = crypto.createHash("md5");
    md5.update(psd);
    psd = md5.digest("hex");
    console.log("----------------------password:" + psd);
    client.query('insert into news_crawler.users value(?, ?, ?, ?)', [username, username, psd, 1], function(err,  result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result);
    });
}


function selectNews(client, page, pageCount, callback){
    //page从1开始
        //确保转换成数字格式
    page = +page - 1;
    pageCount = +pageCount;
    var start = page * pageCount;
    console.log("start : " + start);
    client.query('select * from news order by crawlDate Desc limit ?, ?', [start, pageCount], function(err, result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result);
    });
}

function getNewsCount(client, callback){
    //获取全部新闻数目
    client.query("select count(*) as allCount from news;", function(err, result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result[0].allCount);
    })
}

function getOneNews(client, id, callback){
    client.query("select * from news where news_id = ?", [id], function(err, result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result);
    })
}

function deleteOneNews(client, id, callback){
    //先删除评论
    client.query("delete from news_comments where news_id = ?", [id], function(err, result){
        if(err){
            console.log("err:"+ err.message);
            return err;
        }
        //再删除 新闻
        client.query("delete from news where news_id = ?", [id], function(err, result){
            if(err){
                console.log("error:" + err.message);
                return err;
            }
            callback(result);
        })
    });
}

function updateOneNews(client, id,  title, author, date, content, source, link,  callback){
    date = String(date);
    client.query("update news set title = ?, author = ?, content = ?, date = ?, source = ?, link = ? where news_id = ?", [title,author,content,date,source,link,id], function(err, result){
    //client.query("update news set title = ?, author = ?, source = ? where news_id = ?", [title, author, source, id], function(err, result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result);
    })
}

function insertOneNews(client, id,  title, author, date, content, source, link,  callback){
    date = String(date);
    var crawlDate = new Date();
    client.query("insert into news(crawlDate, news_id,title,author,content,date,source,link) value (?,?,?,?,?,?,?,?)", [crawlDate,id,title,author,content,date,source,link], function(err, result){
        //client.query("update news set title = ?, author = ?, source = ? where news_id = ?", [title, author, source, id], function(err, result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result);
    })
}


function selectComments(client, news_id, callback){
    client.query("select * from news_comments where news_id = ? order by create_time Desc;", [news_id], function(err, result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result);
    })
}

function insertComments(client, news_id, user_id, comment, callback){
    var md5 = crypto.createHash("md5");
    var time = new Date();
    time = time.toLocaleString();
    var comment_id = time+news_id;
    md5.update(comment_id);
    comment_id = md5.digest("hex");
    client.query("insert into news_comments(comment_id, news_id, user_id, comment, create_time) value (?, ?, ?, ?, ?);", [comment_id ,news_id,user_id,comment,time], function(err, result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result);
    })
}

function deleteComments(client, comment_id, callback){
    client.query("delete from news_comments where comment_id = ?", [comment_id], function(err, result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result);
    })
}

function updateComments(client, comment_id,  comment,  callback){
    client.query("update news_comments set comment = ? where comment_id = ?", [comment, comment_id], function(err, result){
        if(err){
            console.log("err: " + err.message );
            return err;
        }
        callback(result);
    })
}

function selectAdminComments(client, page, pageCount, callback){
    //page从1开始
    //确保转换成数字格式
    page = +page - 1;
    pageCount = +pageCount;
    var start = page * pageCount;
    console.log("start : " + start);
    client.query('select * from  news, news_comments, users  where news.news_id = news_comments.news_id ' +
        'and news_comments.user_id = users.user_id order by news_comments.news_id  Desc limit ?, ?', [start, pageCount], function(err, result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result);
    });
}

function getCommentsCount(client, callback){
    client.query("select count(*) as allCount from news_comments;", function(err, result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(result[0].allCount);
    })
}

exports.connect = connectServer;
exports.selectUser = selectUser;
exports.insertUser = insertUser;
exports.selectNews = selectNews;
exports.getNewsCount = getNewsCount;

exports.getOneNews = getOneNews;
exports.deleteOneNews = deleteOneNews;
exports.updateOneNews = updateOneNews;
exports.insertOneNews = insertOneNews;


exports.selectComments = selectComments;
exports.insertComments = insertComments;
exports.deleteComments = deleteComments;
exports.updateComments = updateComments;

exports.selectAdminComments = selectAdminComments;
exports.getCommentsCount = getCommentsCount;