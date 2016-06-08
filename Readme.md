#NewsCrawler

##文件目录说明

1. bin : 配置文件
    + credentials.js : 数据库链接以及加密信息
    + dbConnect.js : 数据库操作
    + www : node.js 配置信息
2. node_modules : 项目依赖包
3. public : 公开文件夹
    + admin 后台管理公开文件夹
    + assets 声音文件
    + images 图片文件
    + javascripts js文件
    + stylesheets css文件
4. routes : 路由控制
5. views : 页面视图
    + admin 后台页面
    + layouts 布局
6. app.js : node.js配置文件
7. package.json : 依赖配置文件
8. Readme.md : 说明

##运行环境

1. node.js环境搭建
    + download link : [http://nodejs.cn/](http://nodejs.cn/)
    + windows : [http://jingyan.baidu.com/article/a948d6515d4c850a2dcd2e18.html](http://jingyan.baidu.com/article/a948d6515d4c850a2dcd2e18.html)
    + linux : [http://www.jb51.net/article/78707.htm](http://www.jb51.net/article/78707.htm)
2. 工具包安装
    + nodemon : [http://www.tuicool.com/articles/2AnmEz7](http://www.tuicool.com/articles/2AnmEz7)

##配置文件

1. /bin/credentials.js
    + mysql 登陆信息
    + cookieSecrect 加密信息
2. /bin/www
    + 监测端口：var port = normalizePort(process.env.PORT || '3000');
            //3000为监测的端口

##工程运行

1. node启动：node ./bin/www
2. nodemon启动: nodemon ./bin/www

##浏览器运行：
1. 地址： localhost:3000
    //3000为默认的端口
    