/**
 * Created by cuidong on 16-6-2.
 */
(function(){
    $(".nav.sidebar-menu>li>a").click(function(){
        if($(this).next("ul").hasClass("submenu")){
            $(this).next("ul").slideToggle();
            $(this).closest("li").toggleClass("open");
        }
    })
})();