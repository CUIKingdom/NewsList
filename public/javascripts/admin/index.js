/**
 * Created by cuidong on 16-6-2.
 */
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
            },
            addCommentData: function(data, $scope, page, pageCount, allCount){
                $scope.comments = data;
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
    .factory("changePage", ["ajaxService", "addDataService", "$timeout", function(ajaxService, addDataService ,$timeout){
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
                        //$timeout(function(){
                        //    window.location.reload();
                        //},800);
                        $(".NoData").removeClass("sr-only");
                        $(".adminShow").addClass("sr-only");
                        console.log(data);
                    }
                }, function(err){
                    console.log(err);
                })
            },
            getCommentsPage: function($scope, targetPage){
                var pageCount = $scope.pageCount;
                ajaxService.ajaxFun({
                    url:"/admin/adminGetComment?page="+targetPage+"&pageCount="+pageCount,
                    method: "GET"
                }).then(function(result){
                    console.log(result);
                    var status = result.status;
                    var data = result.data;
                    var allCount = result.allCount;
                    if(status){
                        //说明有数据
                        addDataService.addCommentData(data,$scope,targetPage,pageCount,allCount);
                    }else{
                        console.log(data);
                        //$timeout(function(){
                        //    window.location.reload();
                        //},800);
                        $(".NoData").removeClass("sr-only");
                        $(".adminShow").addClass("sr-only");
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
                    $(".NoData").removeClass("sr-only");
                    $(".adminShow").addClass("sr-only");
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
        };


        // 后台管理界面 新增 编辑和删除功能
        $scope.editNews = function(news_id){
            window.location.href = "/admin/editNews?id=" + news_id;
        };

        $scope.deleteNews = function(news_id){
            ajaxService.ajaxFun({
                url : "deleteNews?id=" + news_id,
                method: "GET"
            }).then(function(result){
                if(result.status){
                    //删除成功
                    Notify('成功删除该条记录', 'top-right', '3000', 'success', 'fa-success', true);
                    changePage.getPage($scope,1);
                }
            },function(err){
                console.log(err);
            })
        };
    }])
    .controller("newsController", ["ajaxService", "$scope", "$timeout", function(ajaxService, $scope, $timeout){
        $scope.submitForm = function(){
            var form = $("#newsForm").serializeArray();
            console.log(form);
            ajaxService.ajaxFun({
                url: 'updateNews',
                method: "POST",
                data: form
            }).then(function(result){
                console.log(result);
                if(result.status){
                    Notify('保存成功', 'top-right', '3000', 'success', 'fa-success', true);
                    $timeout(function(){
                        window.location.href="/admin/index";
                    },1000);
                }else{
                    Notify('保存失败', 'top-right', '3000', 'warning', 'fa-warning', true);
                }
            }, function(err){
                console.log(err);
            });
        };
    }])
    .controller("commentsController", ["ajaxService", "$scope", "addDataService", "changePage",  function(ajaxService, $scope, addDataService,changePage){
        var page = 1;
        var pageCount = 10;
        ajaxService.ajaxFun({
            url:"/admin/adminGetComment?page="+page+"&pageCount="+pageCount,
            method: "GET"
        }).then(function(result){
                console.log(result);
                var status = result.status;
                var data = result.data;
                var allCount = result.allCount;
                if(status){
                    //说明有数据
                    addDataService.addCommentData(data,$scope,page,pageCount,allCount);
                }else{
                    console.log(data);
                    $(".NoData").removeClass("sr-only");
                    $(".adminShow").addClass("sr-only");
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
                        if(page!==1) changePage.getCommentsPage($scope,1);

                    }else if(nowPage>allPages){
                        Notify("最后一页是"+allPages, 'top-right', '3000', 'warning', 'fa-warning', true);
                        //console.log("最后一页是"+allPages);
                        //获取最后一页
                        if(page!==allPages) changePage.getCommentsPage($scope, allPages);

                    }else{
                        //获取普通页面
                        changePage.getCommentsPage($scope, nowPage);
                    }{
            ajaxService.ajaxFun({
                url : "deleteNews?id=" + news_id,
                method: "GET"
            }).then(function(result){
                if(result.status){
                    //删除成功
                    Notify('成功删除该条记录', 'top-right', '3000', 'success', 'fa-success', true);
                    changePage.getPage($scope,1);
                }
            },function(err){
                console.log(err);
            })
        };
                    break;
                case "prev":
                    if(nowPage<1){
                        Notify('不能往前了', 'top-right', '3000', 'warning', 'fa-warning', true);
                        //console.log("不能往前了");
                        //获取第一页
                        if(page!==1) changePage.getCommentsPage($scope, 1);
                    }else{
                        changePage.getCommentsPage($scope, nowPage);
                    }
                    break;
                case "next":
                    if(nowPage>allPages){
                        Notify('最后一页了', 'top-right', '3000', 'warning', 'fa-warning', true);
                        //console.log("最后一页了");
                        //获取最后一页
                        if(page!==allPages) changePage.getCommentsPage($scope, 1);
                    }else{
                        changePage.getCommentsPage($scope, nowPage);
                    }
                    break;
                default :console.log("error");
            }
        };

        $scope.deleteComment = function(comment_id){
            console.log(comment_id);
            ajaxService.ajaxFun({
                url : "/admin/deleteComments?id=" + comment_id,
                method: "GET"
            }).then(function(result){
                if(result.status){
                    //删除成功
                    Notify('成功删除该条记录', 'top-right', '3000', 'success', 'fa-success', true);
                    changePage.getCommentsPage($scope,1);
                }
            },function(err){
                console.log(err);
            })
        };
        $scope.showNews = function(id){
            window.location.href = "/showNews?id=" + id;
        };

    }]);