/**
 * Created by cuidong on 16-5-31.
 */
(function(){

    function identifyPassword(){
        var passwordText = $("#password").val();
        var username = $("#username").val();
        var repeatPasswordText = $("#repeatPassword").val();
        if(username && passwordText && repeatPasswordText === passwordText){
            $("#result").addClass('sr-only');
            $("#submitButton").removeAttr("disabled");
        }else if(username && passwordText){
            $("#result").html("两次输入的密码不一致").removeClass('sr-only');
            $("#submitButton").attr("disabled", 'disabled');
        }else if(passwordText){
            $("#result").html("用户名不能为空").removeClass('sr-only');
            $("#submitButton").attr("disabled", 'disabled');
        }else{
            $("#result").html("密码不能为空").removeClass('sr-only');
            $("#submitButton").attr("disabled", 'disabled');
        }
    }

    $(document).ready(function(){
        var username = $("#username");
        var repeatPassword = $("#repeatPassword");
        var password = $("#password");
        username.keyup(function(){
            identifyPassword();
        });
        repeatPassword.keyup(function () {
            identifyPassword();
        });
        password.keyup(function(){
            identifyPassword();
        });

        $("#submitButton").click(function(){
            var username = $("#username").val();
            var password = $("#password").val();
            console.log( "register 输入的" + username + password);
            if(username&&password){
                $.post("/register", {username: username, password: password})
                    .success(function(result){
                        if(result.status){
                            $("#result").html(result.data).removeClass("sr-only");
                            window.location.href = "/login";
                        }else{
                            //用户名已经存在
                            $("#result").html(result.data).removeClass("sr-only");
                        }
                    }).fail(function(err){
                        console.log(err);
                    })
            }else{
                $("#result").html("用户名和密码不能为空").removeClass("sr-only");
            }
        })
    });
})();