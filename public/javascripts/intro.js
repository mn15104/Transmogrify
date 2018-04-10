


function init(){
    console.log("hello");
    $('#right-arrow').click(function(){
        $('#left-arrow').fadeOut();
        $('.title.left').addClass('slide_down');
        $('.title.right').addClass('selected');
        $('.left_half').delay(2000).animate({left:'0%'}, {duration:2000});
        $('.right_half').delay(2000).animate({left:'100%'}, {duration:2000, complete: function(){
            location.href="http://localhost:3000/";
        }});
    });
    $('#left-arrow').click(function(){
        $('#right-arrow').fadeOut();
        $('.title.right').addClass('slide_down');
        $('.title.left').addClass('selected');
        $('.left_half').delay(2000).animate({left:'-100%'}, {duration:2000});
        $('.right_half').delay(2000).animate({left:'-50%'}, {duration:2000, complete:function(){
            location.href="http://localhost:3000/login";
        }});
    });
}