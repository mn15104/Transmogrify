
var page_init = false;
var init = function(){
    // loadMyProfile();
    $('.profile_profile-settings').css('opacity',0);
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
    $('.profile_img').one('click', function() {
        flipProfileImg();
    });
    $('.flip-profile-icon').click(function() {
        flipProfileCard();
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
    // $('.play').click(function(){
    //     var player = $(this);
    //     initAudio(player);
    // });

    setInterval(updateBlur, 1000);
}

var flipProfileImg = function(){
    $("#profile_card").toggleClass("flipped");
    $('.profile_title').removeClass('profile_title_middle').addClass('profile_title_active');
    $(".profile_card").animate({"left":"100%"}, {duration:1100, complete:function(){
        $('#profile_profile-description').slideDown(600,false, function(){
            $(".profile_gallery-wrapper").fadeIn('slow');
        });
    }});
    $("#sidebar-horizontal").fadeIn("slow");
}

var flipProfileCard = function(){
    if(!$('#profile_card').hasClass('flipped')){
        $("#profile_card").toggleClass("flipped");
        $('#profile_profile-public').animate({opacity: 0}, {duration: 650, queue: false});
        $('.profile_profile-settings').animate({opacity: 1}, {duration: 700, queue: false});
    }
    else{     
        $("#profile_card").toggleClass("flipped");
        $('.profile_profile-settings').animate({opacity: 0}, {duration: 500, queue: false});
        $('#profile_profile-public').animate({opacity: 1}, {duration: 700, queue: false});
    }
}
var toggleChatbox = function(){
    if(!($('#profile_chat-btn').hasClass('profile_chat_open'))){
        $(".profile_card").animate({width:"150%", left:"100%"}, 'slow');
        $('.chat_container').slideDown('slow');
        $(".profile_img").animate({left:"15%"}, 'fast');
        $('#profile_chat-btn').addClass('profile_chat_open');
    }
    else {
        $('.chat_container').slideUp('slow', function(){
          
        });  
        $(".profile_card").animate({width:"100%", left:"100%"}, 'slow');
        $(".profile_img").animate({left:"2%"}, 'fast');
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

