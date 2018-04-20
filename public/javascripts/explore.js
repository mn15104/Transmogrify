
// var newMusicplayer = new musicPlayer;
function init(){
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            nextRow();
        }
    });
   
    $('.flipper').click(function(){
        if(!$(this).hasClass('flipped'))
            $(this).toggleClass('flipped');
    })
    
    $('.brick .brick_profile_img').click(function(){
        $('.explore_wrapper').animate(
            { "margin-left": "-100vw" },
            { queue: false, duration: 2000, complete:function(){
                $.getScript("sidepanel.js",function(){
                    transitionToProfilePage();
                })
            } });
    })
    $('.explore_title').css('opacity', 0)
                        .slideDown('slow')
                        .animate(
                        { opacity: 1 },
                        { queue: false, duration: 2000 });


    if (performance.navigation.type == 1) {
      refreshAudio();
    }

    $('.play').click(function(){
        var player = $(this);
        initAudio(player);
    });

    setInterval(updateBlur, 1000);
}

function refreshAudio(){
    var curr_player = $('#CURRENT_PLAYER');
    curr_player.closest('.brick').find('.brick-img').css({
        "-webkit-filter": "blur(0px)",
        "filter": "blur(0px)"});
    curr_player.closest('.brick').find('.brick-audio').empty();
    curr_player.removeAttr("id");
    $.getScript("audio_wave.js",function(){
            stopSound();
    });
}

function initAudio(player){
    player.toggleClass('pause');
    player.closest('.play-container').toggleClass('pause');
    player.closest('.control-panel').toggleClass('active');
    player.closest('.brick').find('.info-bar').toggleClass('active');
    
    if(!player.hasClass('pause')) {
        //////
        if($('#CURRENT_PLAYER').length != 0){
            CURRENT_PLAYER = $('#CURRENT_PLAYER');
            if(!player.is('#CURRENT_PLAYER')){
                $.getScript("audio_wave.js",function(){
                    stopSound();
                });
                $('#CURRENT_PLAYER').closest('.brick').find('.brick-img').css({
                    "-webkit-filter": "blur(0px)",
                    "filter": "blur(0px)"});
                CURRENT_PLAYER.removeAttr("id");
                CURRENT_PLAYER.toggleClass('pause');
                CURRENT_PLAYER.closest('.play-container').toggleClass('pause');
                CURRENT_PLAYER.closest('.control-panel').toggleClass('active');
                CURRENT_PLAYER.closest('.brick').find('.info-bar').toggleClass('active');
                CURRENT_PLAYER.closest('.brick').find('.brick-audio').empty();
                player.attr("id", "CURRENT_PLAYER");
                player.closest('.brick').find('.brick-audio').load("../views/audio_wave.html");
                $.getScript("audio_wave.js",function(){
                    init();
                });
            }
            else{
                $.getScript("audio_wave.js",function(){
                    stopSound();
                    init();
                });
            }
        }
        else{
            player.attr('id', 'CURRENT_PLAYER');
            player.closest('.brick').find('.brick-audio').load("../views/audio_wave.html");
            $.getScript("audio_wave.js",function(){
                init();
            });
        }
    }
    else {
        $('#CURRENT_PLAYER').closest('.brick').find('.brick-img').css({
            "-webkit-filter": "blur(0px)",
            "filter": "blur(0px)"});
        $('#CURRENT_PLAYER').closest('.brick').find('.brick-audio').empty();
        $(this).removeAttr("id");
        $.getScript("audio_wave.js",function(){
                stopSound();
        });
    }
}

function updateBlur(){
    if($('#CURRENT_PLAYER').length != 0){
        if(!$('#CURRENT_PLAYER').hasClass('pause')){
            tweenBlur(0, 1);
        }
    }
}

function setBlur(radius) {
	ele = $('#CURRENT_PLAYER').closest('.brick').find('.brick-img');
	$(ele).css({
	   "-webkit-filter": "blur("+radius+"px)",
		"filter": "blur("+radius+"px)"
   });
};

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
};

function retrieveFileData(req_file_id){
    $.ajax({
        url: '/explore.html/loadfiledatabyid',
        type: 'GET',
        data: req_file_id,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Error during id request : " + thrownError);
        },
        xhr: function() {
          
        }
    });
}

function retrieveImageFile(req_file_id){
    $.ajax({
        url: '/explore.html/loadimagefilebyid',
        type: 'GET',
        data: req_file_id,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Error during id request : " + thrownError);
        },
        xhr: function() {
          
        }
    });
}

function retrieveAudioFile(req_file_id){
    $.ajax({
        url: '/explore.html/loadaudiofilebyid',
        type: 'GET',
        data: req_file_id,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Error during id request : " + thrownError);
        },
        xhr: function() {
          
        }
    });
}

function retrieveProfileImage(req_user_id){
    $.ajax({
        url: '/explore.html/loadprofileimage',
        type: 'GET',
        data: req_file_id,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Error during id request : " + thrownError);
        },
        xhr: function() {
          
        }
    });
}

function generateBrick(){
    '<figure class="brick"'   +  
    'data-username   = ""'    +
    'data-date       = ""'    +
    'data-file-id    = "">'   +
    '<div class = "brick-img-audio-container">' +
        '<img  class = "brick-img" src="">'     +
        '<div class = "brick-audio"> </div>'    +
    '</div>'                                    +    
    '<div class="player">'                                  +
        '<div class="control-panel">'                       +
            '<div class="album-art brick_profile_img">'     +
                '<span><img class = "profile_img"/></span>' +
            '</div>'                                        +
            '<div class="info-bar">'                        +        
                '<span class="artist">  </span>'         +
                '<span class="name">   </span>'          +
                '<div class="progress-bar">'        +
                    '<div class="bar"></div>'       +
                '</div>'                            +                
            '</div>'                                +
            '<div class="controls">'                +
                '<div class="play-container pause">'+
                    '<i class="fa fa-play play pause" aria-hidden="true"></i>' +
                '</div>'            +
    '</div></div> </div></figure>'  
}