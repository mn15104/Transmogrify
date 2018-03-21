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
        var brick = $(this).parent('.brick');
        $('.flipper').css({'transform':'translateY(1000px)'},'slow');
        $('.brick_profile_img').not(this).css({'transform':'translateY(1000px)'},'slow');
    })
    $('.explore_title')
    .css('opacity', 0)
    .slideDown('slow')
    .animate(
    { opacity: 1 },
    { queue: false, duration: 2000 }
);
}

function nextRow(){
    var children = $(".brickwall").children("figure");
    $(children).clone().appendTo(".brickwall");

    console.log("next row")
}