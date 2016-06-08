/**
 * Created by cuidong on 16-5-31.
 */
(function(){
    var submitBtn = $("#submit");
    submitBtn.click(function(){
        var username = $("#username").val();
        var password = $("#password").val();
        console.log(username+"  "+password);
        $.post("/login", {username: username, password: password})
            .success(function(result){
                var status = result.status;
                var data = result.data;
                if(!status){
                    $("#result").html(data).removeClass("sr-only");
                }else{
                    window.location.href = '/';
                }
                console.log(result);
            }).fail(function(err){
                console.log(err);
            })
    });
})();