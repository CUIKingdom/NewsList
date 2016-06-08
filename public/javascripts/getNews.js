/**
 * Created by cuidong on 16-6-1.
 */
//  本js与  ./javascripts/getNews.js相似
angular.module("myApp",[])
    .factory("ajaxService", ["$http", "$q", function($http, $q){
        return{
            ajaxFun: function(params){
                var deferred = $q.defer();
                var params = params || "";
                $http({
                    method : params.method || 'post',
                    url : params.url || '',
                    data : params. data || {},
                    responseType : params.type || 'json'
                }).success(function(data){
                    deferred.resolve(data);
                }).error(function(reason){
                    deferred.reject(reason);
                });
                return deferred.promise;
            }
        }
    }])
    .factory("addDataService", [function(){
        return{
            addData: function(data, $scope, page, pageCount, allCount){
                for(var i in data){
                    data[i].crawlDate = (new Date(data[i].crawlDate)).toLocaleString();
                }
                $scope.news = data;
                $scope.page = page;
                $scope.pageCount = pageCount;
                $scope.allCount = allCount;
                $scope.nowPage = Number(page);
                //计算页数
                var allPages = Math.ceil(+allCount/+pageCount);
                $scope.allPages = allPages;
                $("#nowPage").val(page);
            }
        }
    }])
    .factory("changePage", ["ajaxService", "addDataService", function(ajaxService, addDataService){
        return{
            getPage: function($scope, targetPage){
                var pageCount = $scope.pageCount;
                ajaxService.ajaxFun({
                    url:"/getNews?page="+targetPage+"&pageCount="+pageCount,
                    method: "GET"
                }).then(function(result){
                    console.log(result);
                    var status = result.status;
                    var data = result.data;
                    var allCount = result.allCount;
                    if(status){
                        //说明有数据
                        addDataService.addData(data,$scope,targetPage,pageCount,allCount);
                    }else{
                        console.log(data);
                    }
                }, function(err){
                    console.log(err);
                })
            }
        }
    }])
    .controller("mainController", ["$scope", "ajaxService", "addDataService",　"changePage", function($scope, ajaxService, addDataService, changePage){
        var page = 1;
        var pageCount = 10;
        ajaxService.ajaxFun({
            url:"/getNews?page="+page+"&pageCount="+pageCount,
            method: "GET"
        }).then(function(result){
            console.log(result);
                var status = result.status;
                var data = result.data;
                var allCount = result.allCount;
                if(status){
                    //说明有数据
                    addDataService.addData(data,$scope,page,pageCount,allCount);
                }else{
                    console.log(data);
                }
            },
            function(err){
                console.log(err);
            }
        );

        $scope.changePage = function(str, nowPage, $event){
            nowPage = +nowPage;
            var allPages = $scope.allPages;
            var page = $scope.page;
            switch(str){
                case "num":
                    if($event.keyCode!==13) return;
                    if(nowPage<1){
                        Notify('这是第一页', 'top-right', '3000', 'warning', 'fa-warning', true);
                        //console.log("这是第一页");
                        //获取第一页
                        if(page!==1) changePage.getPage($scope,1);

                    }else if(nowPage>allPages){
                        Notify("最后一页是"+allPages, 'top-right', '3000', 'warning', 'fa-warning', true);
                        //console.log("最后一页是"+allPages);
                        //获取最后一页
                        if(page!==allPages) changePage.getPage($scope, allPages);

                    }else{
                        //获取普通页面
                        changePage.getPage($scope, nowPage);
                    }
                    break;
                case "prev":
                    if(nowPage<1){
                        Notify('不能往前了', 'top-right', '3000', 'warning', 'fa-warning', true);
                        //console.log("不能往前了");
                        //获取第一页
                        if(page!==1) changePage.getPage($scope, 1);
                    }else{
                        changePage.getPage($scope, nowPage);
                    }
                    break;
                case "next":
                    if(nowPage>allPages){
                        Notify('最后一页了', 'top-right', '3000', 'warning', 'fa-warning', true);
                        //console.log("最后一页了");
                        //获取最后一页
                        if(page!==allPages) changePage.getPage($scope, 1);
                    }else{
                        changePage.getPage($scope, nowPage);
                    }
                    break;
                default :console.log("error");
            }
        };

        $scope.showNews = function(id){
            window.location.href = "/showNews?id=" + id;
        }
    }])
    .controller("newsController", ["ajaxService", "$scope", function(ajaxService, $scope){
        var news_id =　$("#hiddenData").attr("data-newsId");
        //获取所有的评论
        console.log(news_id);
        ajaxService.ajaxFun({
            url: "/getComments?id="+news_id,
            method: "GET"
        }).then(function(result){
            $scope.comments = {};
            $scope.comments.status = result.status;
            for(var i in result.data){
                result.data[i].create_time = (new Date(result.data[i].create_time)).toLocaleString();
            }
            $scope.comments.data = result.data;
            $scope.islogin = $("#hiddenData").attr("data-islogin");
            if($scope.islogin){
                $("#publishComment").removeAttr("disabled");
                $("textarea").removeAttr("disabled").attr("placeholder", '您可以填写并提交评论');
            }
        }, function(err){
            console.log(err);
        });

        $scope.publishComment = function(id){
            console.log(id);
            var comment = $("textarea").val();
            var user_id = $("#hiddenData").attr("data-islogin");
            //提交评论
            var commentData = {
                news_id : id,
                comment: comment,
                user_id: user_id
            };
            ajaxService.ajaxFun({
                url: "/insertComment",
                method: "POST",
                data: commentData
            }).then(function(result){
                if(result.status){
                    //插入成功
                    window.location.reload();
                }else{
                    console.log("insert err");
                }
            }, function(err){
                console.log(err);
            })
        }

    }]);