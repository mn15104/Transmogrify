


function init(){
    console.log("hello");
    $('#right-arrow').click(function(){
        $('.title.left').addClass('slide_down');
        $('.title.right').addClass('selected');
    });
    $('#left-arrow').click(function(){
        console.log("hi");
        $('.title.right').addClass('slide_down');
        $('.title.left').addClass('selected');
    });
}