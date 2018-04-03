
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
        var brick = $(this).parent('.brick');
        $('.flipper').css({'transform':'translateY(1000px)'},'slow');
        $('.brick_profile_img').not(this).css({'transform':'translateY(1000px)'},'slow');
    })
    $('.explore_title')
    .css('opacity', 0)
    .slideDown('slow')
    .animate(
    { opacity: 1 },
    { queue: false, duration: 2000 }
    );
    //check for navigation time API support
    if (window.performance) {
        console.info("window.performance work's fine on this browser");
    }
    if (performance.navigation.type == 1) {
      console.info( "This page is reloaded" );
    } else {
      console.info( "This page is not reloaded");
    }

    //
    $('.play').click(function(){
        var player_pressed = $(this);
        $(this).toggleClass('pause');
        $(this).closest('.play-container').toggleClass('pause');
        $(this).closest('.control-panel').toggleClass('active');
        $(this).closest('.brick').find('.info-bar').toggleClass('active');
        
        if(!$(this).hasClass('pause')) {
            //////
            if($('#CURRENT_PLAYER').length != 0){
                if(!player_pressed.is('#CURRENT_PLAYER')){
                    console.log("SHIT");
                    $.getScript("music.js",function(){
                        stopSound();
                    });
                    CURRENT_PLAYER = $('#CURRENT_PLAYER');
                    CURRENT_PLAYER.removeAttr("id");
                    CURRENT_PLAYER.toggleClass('pause');
                    CURRENT_PLAYER.closest('.play-container').toggleClass('pause');
                    CURRENT_PLAYER.closest('.control-panel').toggleClass('active');
                    CURRENT_PLAYER.closest('.brick').find('.info-bar').toggleClass('active');
                    CURRENT_PLAYER.closest('.brick').find('.brick-audio').empty();
                    player_pressed.attr("id", "CURRENT_PLAYER");
                    player_pressed.closest('.brick').find('.brick-audio').load("../views/music.html");
                    $.getScript("music.js",function(){
                        init();
                    });
                }
                else{
                    $.getScript("music.js",function(){
                        stopSound();
                        init();
                    });
                }
            }
            //////
            else{
                player_pressed.attr('id', 'CURRENT_PLAYER');
                player_pressed.closest('.brick').find('.brick-audio').load("../views/music.html");
                $.getScript("music.js",function(){
                    init();
                });
            }
        }
        else {
            $(this).removeAttr("id");
            $.getScript("music.js",function(){
                 stopSound();
            });
        }
});

    // class musicPlayer {
    //     constructor() {
    //         this.play = this.play.bind(this);
    //         this.playBtn = $('#CURRENT_PLAYER');
    //         $(this.playBtn).on('click', this.play);
    //         this.controlPanel = $(this.playBtn).closest('.control-panel');
    //         this.infoBar = $(this.playBtn).closest('.info');
    //         if(this.infoBar == 0) console.log("not found\n");
    //     }
    //     play() {

                
    //     }
    // }


}


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