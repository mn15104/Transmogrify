
// var newMusicplayer = new musicPlayer;
function init(){
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            nextRow();
        }
    });
    $('.brick-wall').hide();
    $('.brick-wall').fadeIn();
    $('.flipper').click(function(){
        if(!$(this).hasClass('flipped'))
            $(this).toggleClass('flipped');
    })
    
    $('.brick .brick_profile_img').click(function(){
        brick_user_id = $($(this).closest('.brick')).data('user-id');
        $('.explore_wrapper').animate(
            { "margin-left": "-100vw" },
            { queue: false, duration: 2000, complete:function(){
                 viewProfile(brick_user_id);
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

    bricks = retrieveFileData(20, 2);
    // for(i = 0; i < bricks.length; i++){

    // }
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
                init();
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
        $(this).removeAttr("id");
        $.getScript("audio_wave.js",function(){
                stopSound();
        });
    }
}

function retrieveFileData(numb, req_file_id){
    $.ajax({
        url: '/explore/loadfile',
        type: 'POST',
        data: {'num_files' : numb,
               'pair_id': req_file_id},
        success: function(data){
            console.log(data);
            return data;
        },
        error: function (err) {
            console.log(err);
        }
    });
}

var viewProfile = function(user_id){
    loadOtherProfilePage(user_id);
}

function generateBrick(file_data){
    '<figure class="brick"'      +   
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
        '<img  class = "brick-img" src="'       +  file_data.file_path + '">'
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