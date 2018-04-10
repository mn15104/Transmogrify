


function init(){
    console.log("hello");
    $('#right-arrow').click(function(){
        $('.title.left').addClass('slide_down');
        $('.title.right').addClass('selected');
        $('.left_half').animate({left:'50%'}, {duration:2000});
        $('.right_half').animate({left:'50%'}, {duration:2000});
    });
    $('#left-arrow').click(function(){
        
        $('.title.right').addClass('slide_down');
        $('.title.left').addClass('selected');
        $('.left_half').animate({left:'-50%'}, {duration:2000});
        $('.right_half').animate({left:'-50%'}, {duration:2000});
    });
}