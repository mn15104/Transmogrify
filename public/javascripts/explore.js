function init(){
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            nextRow();
        }
    });
    $('.flipper').click(function(){
        $(this).toggleClass('flipped');
    })
    $('.brick-wall .brick_profile_img').click(function(){
       var brick = $(this).parent('.brick');
       var flip = $(this).siblings('.flipper');
       var eTop = $(this).offset().left; //get the offset top of the element
       var posx = (eTop - $(document).width()); //position of the ele w.r.t window
       var xmove = ($(document).width())/2 - posx;
       $('.brick').not(brick).fadeOut('slow');
       $(flip).animate({'opacity':'0'}, 'slow');
       $(this).animate({'opacity':'1',}, 'slow');
       
    })
}

function nextRow(){
    var children = $(".brickwall").children("figure");
    $(children).clone().appendTo(".brickwall");

    console.log("next row")
}