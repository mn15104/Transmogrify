
var init = function(){
    $('.chat_container').hide();
    $('.profile_title_container').slideDown('slow');
    $('#profile_card').css({'background':'none'});
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
        toggleProfileImg();
        
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

var toggleProfileImg = function(){
    $("#profile_card").toggleClass("flipped", function(){
        if($('#profile_card').hasClass('flipped')){
            $('#profile_profile-description').animate({opacity: 0}, {duration: 800});
        }
        else{     
            $('#profile_profile-description').animate({opacity: 1}, {duration: 800});
            $(".profile_card").css({"margin-right":"2000px"}).animate({"left":"400px"}, {duration:1100});
            $('.profile_title').removeClass('profile_title_middle').addClass('profile_title_active');
            $(".profile_card").css({"margin-right":"2000px"}).animate({"top":"-100px"}, {duration:1100});
            $('#profile_profile-description').slideDown(600, function(){
                $(".profile_gallery-wrapper").fadeIn('slow');
            });

        }


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
var loadChatHistory = function(){
    $.ajax({
        url: '/profile/chat/loadhistory',
        type: 'POST',
        data: _____,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('message sent\n' + data);
        }
      });
}
var sendMessage = function(){
    var message = $('#chat_input').text();
    $.ajax({
        url: '/profile/chat/send',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('message sent\n' + data);
        }
      });
}