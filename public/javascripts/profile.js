
var page_init = false;
var all_images_loaded = false;
var init_profile = function(){
    console.log("hi");
    retrieveFileData(20, 'max',  $('.chat_container').attr('data-user-id'));
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
    console.log("CALLED");
    $.ajax({
        url: '/profile/loadfile',
        type: 'POST',
        data: {'num_files' : numb,
               'pair_id': req_file_id,
               'user_id': req_user_id},
        success: function(data){
            dataObj = JSON.parse(data);
            if(dataObj.length < numb){
                all_images_loaded = true;
            }
            for(var i = 0; i < dataObj.length; i++){
                generateBrick(dataObj[i]);
                $('.brick .brick_profile_img').click(function(){
                    brick_user_id = $($(this).closest('.brick')).data('user-id');
                    $('.explore_wrapper').animate(
                        { "margin-left": "-100vw" },
                        { queue: false, duration: 2000, complete:function(){
                             viewProfile(brick_user_id);
                        } });
                })
                console.log(i);
            }
            $('.play-container').click(function(){
                var player = $(this);
                initAudio(player);
            });
            return data;
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function generateBrick(file_data){
    var styleEl = document.createElement('style'),
                    styleSheet;

    document.head.appendChild(styleEl);

    styleSheet = styleEl.sheet;
    styleSheet.insertRule('#pair' + file_data.pair_id + ' .player .control-panel .album-art::before' + '{ background-image: url(' + file_data.profile_picture + ');}', styleSheet.cssRules.length);
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
                'id = "pair' + file_data.pair_id + '">'  +
                '<div class = "brick-img-audio-container">' +
                    '<img  class = "brick-img" src="'       +  file_data.file_path + '">' +
                    '<div class = "brick-audio"> </div>'    +
                '</div>'                                    +    
                '<div class="player">'                                  +
                    '<div class="control-panel">'                       +
                        '<div class="album-art brick_profile_img" style="background-image:url('+ file_data.profile_picture +')">'  +
                            // '<span><img class = "profile_img"/></span>' +
                        '</div>'                                        +
                        '<div class="info-bar">'                        +        
                            '<span class="artist">' + file_data.firstname + '</span>' +
                            '<span class="name">' + file_data.file_name + '</span>'   +           
                        '</div>'                                +
                        '<div class="controls">'                +
                            '<div class="play-container pause">'+
                                '<i class="fa fa-play play" aria-hidden="true"></i>' +
                            '</div>'            +
                '</div></div></div></figure>'  
    
    $('.brick-wall').append(brick);
}
function initAudio(player){
    player.toggleClass('pause');
    player.closest('.control-panel').toggleClass('active');
    player.closest('.player').find('.info-bar').toggleClass('active');
    player.closest('.brick').find('.brick-img-audio-container').toggleClass('animate_gradient');

    primaryDetected = parseFloat(player.closest('.brick').attr('data-primaryDetected'));
    colourDetected = parseFloat( player.closest('.brick').attr('data-colourDetected'));
    decision1 = parseFloat(player.closest('.brick').attr('data-decision1'));
    decision2 = parseFloat(player.closest('.brick').attr('data-decision2'));
    decision3 = parseFloat(player.closest('.brick').attr('data-decision3'));
    decision4 = parseFloat(player.closest('.brick').attr('data-decision4'));
    yClrSym = parseFloat(player.closest('.brick').attr('data-yClrSym'));
    yFineSym = parseFloat(player.closest('.brick').attr('data-yFineSym'));
    xClrSym = parseFloat(player.closest('.brick').attr('data-xClrSym'));
    xFineSym = parseFloat(player.closest('.brick').attr('data-xFineSym'));

    if(!player.hasClass('pause')) {
        if($('#CURRENT_PLAYER').length != 0){
            CURRENT_PLAYER = $('#CURRENT_PLAYER');
            if(player.attr('id') !== 'CURRENT_PLAYER'){
                stopAudio(function(){
                    audioTester(primaryDetected, colourDetected, decision1, decision2, decision3, decision4,
                        yClrSym, yFineSym, xClrSym, xFineSym);
                });
                $('#CURRENT_PLAYER').closest('.brick').find('.brick-img').css({
                    "-webkit-filter": "blur(0px)",
                    "filter": "blur(0px)"});
                CURRENT_PLAYER.removeAttr("id");
                if(!CURRENT_PLAYER.hasClass('pause')){
                    CURRENT_PLAYER.toggleClass('pause');
                    CURRENT_PLAYER.closest('.brick').find('.brick-img-audio-container').toggleClass('animate_gradient');
                    CURRENT_PLAYER.closest('.control-panel').toggleClass('active');
                    CURRENT_PLAYER.closest('.brick').find('.info-bar').toggleClass('active');
                    CURRENT_PLAYER.closest('.brick').find('.brick-audio').empty();
                }
                player.attr("id", "CURRENT_PLAYER");
                player.closest('.brick').find('.brick-audio').html("<canvas id='music_visual_audioDebug'></canvas>");
            }
            else{
                audioTester(primaryDetected, colourDetected, decision1, decision2, decision3, decision4,
                    yClrSym, yFineSym, xClrSym, xFineSym);
            }
        }
        else{
            player.attr('id', 'CURRENT_PLAYER');
            player.closest('.brick').find('.brick-audio').html("<canvas id='music_visual_audioDebug'></canvas>");

            audioTester(primaryDetected, colourDetected, decision1, decision2, decision3, decision4,
                yClrSym, yFineSym, xClrSym, xFineSym);
 
        }
    }
    else {
        $('#CURRENT_PLAYER').closest('.brick').find('.brick-img').css({
            "-webkit-filter": "blur(0px)",
            "filter": "blur(0px)"});
        player.removeAttr("id");
        stopAudio();
    }
}


function updateBlur(){
    if($('#CURRENT_PLAYER').length != 0){
        if(!$('#CURRENT_PLAYER').hasClass('pause')){
            tweenBlur(0, 1);
        }
    }
}
var tweenBlur = function(startRadius, endRadius) {
    $({blurRadius: startRadius}).animate({blurRadius: endRadius}, {
        duration: 500,
        easing: 'swing', // or "linear"
                         // use jQuery UI or Easing plugin for more options
        step: function() {
            setBlur(this.blurRadius);
        },
        complete: function() {
            // Final callback to set the target blur radius
            // jQuery might not reach the end value
            setBlur(endRadius);
       }
   });
}
function setBlur(radius) {
	ele = $('#CURRENT_PLAYER').closest('.brick').find('.brick-img');
	$(ele).css({
	   "-webkit-filter": "blur("+radius+"px)",
		"filter": "blur("+radius+"px)"
   });
}