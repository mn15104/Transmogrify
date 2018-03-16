function init(){
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            nextRow();
        }
    });
    $('.brick').click(function(){
        $(this).toggleClass('flipped');
    })
}

function nextRow(){
    var children = $(".brickwall").children("figure");
    $(children).clone().appendTo(".brickwall");

    console.log("next row")
}