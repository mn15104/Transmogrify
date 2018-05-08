
var page_init = false;
var init = function(){
    
    $('.profile_chatbox_container').load('../views/chatbox.html');
    $('.profile_profile-settings').css('opacity',0);
    $('.profile_icon_container').hide();
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

    // setInterval(updateBlur, 1000);
}

var flipProfileImg = function(){
    $("#profile_card").toggleClass("flipped");
    $('.profile_title').removeClass('profile_title_middle').addClass('profile_title_active');
    $(".profile_card").animate({"left":"100%"}, {duration:1100, complete:function(){
        $('#profile_profile-description').slideDown(600,false, function(){
            $(".profile_gallery-wrapper").fadeIn('slow');
            $('.profile_icon_container').fadeIn('slow');
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
         $('#profile_chat-btn').addClass('profile_chat_open');
        //  chat_container = $('.chat_top-bar').parent('.chat_container');
        //  chat_container.toggleClass('chat_container_closed'); 
        //  container_user_id = chat_container.attr('data-chat-user-id');
        //  console.log("THIS" + container_user_id);
         $.getScript("chatbox.js",function(){
            connect();
         });
    }
    else {
        $('#profile_chat-btn').removeClass('profile_chat_open');
        chat_container.toggleClass('chat_container_closed'); 
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

