
var page_init = false;
var all_images_loaded = false;
var init_profile = function(){
    // $('.profile_chatbox_container').load('../views/chatbox.html');
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
    retrieveFileData(20, 'max',  $('.chat_container').attr('data-user-id'));
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
            
        }
      });
}

function retrieveFileData(numb, req_file_id, req_user_id){
    $.ajax({
        url: '/profile/loadfile',
        type: 'POST',
        data: {'num_files' : numb,
               'pair_id': req_file_id,
               'user_id': req_user_id},
        success: function(data){
            dataObj = JSON.parse(data);
            for(var i = 0; i < dataObj.length; i++){
                if(dataObj.length < numb){
                    all_images_loaded = true;
                }
                generateBrick(dataObj[i]);
                $('.brick .brick_profile_img').click(function(){
                    brick_user_id = $($(this).closest('.brick')).data('user-id');
                    $('.explore_wrapper').animate(
                        { "margin-left": "-100vw" },
                        { queue: false, duration: 2000, complete:function(){
                             viewProfile(brick_user_id);
                        } });
                })
                $('.play').click(function(){
                    var player = $(this);
                    initAudio(player);
                });
            }
            return data;
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function generateBrick(file_data){
    brick =     '<figure class="brick"'      +   
                'data-user-id   = "'         + file_data.user_id         + '" ' +
                'data-pair-id   = "'         + file_data.pair_id         + '" ' +
                'data-time      = "'         + file_data.time            + '" ' +
                'data-primaryDetected ="'    + file_data.primaryDetected + '" ' +
                'data-colourDetected ="'     + file_data.colourDetected  + '" ' +
                'data-decision1 ="'          + file_data.decision1       + '" ' +
                'data-decision2 ="'          + file_data.decision2       + '" ' +
                'data-decision3 ="'          + file_data.decision3       + '" ' +
                'data-decision4 ="'          + file_data.decision4       + '" ' +
                'data-yClrSym ="'            + file_data.yClrSym         + '" ' +
                'data-yFineSym ="'           + file_data.yFineSym        + '" ' +
                'data-xClrSym ="'            + file_data.xClrSym         + '" ' +
                'data-xFineSym ="'           + file_data.xFineSym        + '" ' +
                '>'  +
                '<div class = "brick-img-audio-container">' +
                    '<img  class = "brick-img" src="'       +  file_data.file_path + '">' +
                    '<div class = "brick-audio"> </div>'    +
                '</div>'                                    +    
                '<div class="player">'                                  +
                    '<div class="control-panel">'                       +
                        '<div class="album-art brick_profile_img" style="background-image:url('+ file_data.profile_picture +')">'  +
                        '</div>'                                        +
                        '<div class="info-bar">'                        +        
                            '<span class="artist">' + file_data.firstname + '</span>' +
                            '<span class="name">' + file_data.file_name + '</span>'   +           
                        '</div>'                                +
                        '<div class="controls">'                +
                            '<div class="play-container pause">'+
                                '<i class="fa fa-play play pause" aria-hidden="true"></i>' +
                            '</div>'            +
                '</div></div></div></figure>'  
    
    $('.brick-wall').append(brick);
}