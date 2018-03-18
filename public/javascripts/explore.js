function init(){
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            nextRow();
        }
    });
    $('.flipper').click(function(){
        $(this).toggleClass('flipped');
    })
    $('.brick .brick_profile_img').click(function(){
     
    })
}

function nextRow(){
    var children = $(".brickwall").children("figure");
    $(children).clone().appendTo(".brickwall");

    console.log("next row")
}