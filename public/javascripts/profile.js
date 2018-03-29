
var init = function(){
    $('.chat_container').hide();
    $('.profile_title_container').slideDown('slow');
    $('.profile_title').css('opacity', 0)
        .addClass('profile_title_middle')
        .slideDown('slow')
        .animate(
        { opacity: 1 },
        { queue: false, duration: 2000 }
    );
    $(".profile_gallery-wrapper").hide();
    $("#profile_card").toggleClass("flipped");
    $('#profile_profile-description').hide();
    $('.profile_img').hide();
    $('.profile_img').fadeIn("slow");
    $('.profile_img').mouseenter(function() {
        $('.PopUp').css('opacity', '1');
        $('.PopUp').css('margin-top', '20px');
    });

    $('.profile_img').click(function() {
        toggleProfImg();
    });
    $('.profile_img').mouseleave(function() {
        $('.PopUp').css('opacity', '0');
        $('.PopUp').css('margin-top', '0px');
    });
    $('#profile_chat-btn').click(function(){
        toggleChatbox();
    });
    $('.myButton').click(function(){
        sendMessage();
    })
}

var toggleProfImg = function(){
    $("#profile_card").toggleClass("flipped", function(){
        $(".profile_card").css({"margin-right":"2000px"}).animate({"left":"400px"}, "slow");
        $('.profile_title').removeClass('profile_title_middle').addClass('profile_title_active');
        $(".profile_card").css({"margin-right":"2000px"}).animate({"top":"-270px"}, "slow", function(){
            $('#profile_profile-description').slideDown(600);
            // $(".profile_card").animate({"background-color":"#141414"}, 'slow');
            $(".profile_gallery-wrapper").fadeIn('slow');
        });
    });
    $("#sidebar-horizontal").fadeIn("slow");
    var margin = "-2000px";
    
}

var toggleChatbox = function(){
    if(!($('#profile_chat-btn').hasClass('profile_chat_open'))){
        $(".profile_card").animate({width:"500px", left:"310px"}, 'slow', function(){
            $('.chat_container').slideDown('slow');
        });
        $(".profile_img").animate({left:"150px"}, 'fast');
        $('#profile_chat-btn').addClass('profile_chat_open');
    }
    else {
        $('.chat_container').slideUp('slow', function(){
            $(".profile_card").animate({width:"315px", left:"450px"}, 'slow');
            $(".profile_img").animate({left:"55px"}, 'slow');
        });
        $('#profile_chat-btn').removeClass('profile_chat_open');
    }
}

var sendMessage = function(){
    var message = $('#chat_input').text();
    $.ajax({
        url: '/profile/chat',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('message sent\n' + data);
        }
      });
  
}