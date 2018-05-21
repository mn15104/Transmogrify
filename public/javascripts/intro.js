


function init(){
    $('#right-arrow').click(function(){
        $('#left-arrow').fadeOut();
        $('.title.left').addClass('slide_down');
        $('.title.right').addClass('selected');
        $('canvas').fadeOut('slow');
        $('.triangle-left').delay(2000).animate({left:'100%'}, {duration:2000});
        $('.triangle-right').delay(2000).fadeOut('slow');
        $('.title.right').fadeOut(3000);
        $('.left_half').delay(1000).addClass('fade_left').animate({left:'0%'}, {duration:1500});
        $('.right_half').delay(2000).animate({left:'140%'}, {duration:2000, complete: function(){
            location.href="http://localhost:3000/create/home";
            window.URL = 'create'
        }});
      
    });
    $('#left-arrow').click(function(){
        $('#right-arrow').fadeOut();
        $('.title.right').addClass('slide_down');
        $('.title.left').addClass('selected');
        $('canvas').fadeOut('slow');
        $('.triangle-left').delay(2000).animate({left:'-40%'}, {duration:2000});   
        $('.triangle-right').delay(2000).fadeOut('slow');
        $('.title.left').fadeOut(3000);
        $('.left_half').delay(2000).animate({left:'-100%'}, {duration:2000});
        $('.right_half').delay(2000).animate({left:'-50%'}, {duration:2000, complete:function(){
            location.href="http://localhost:3000/login";
        }});
      
    });
}