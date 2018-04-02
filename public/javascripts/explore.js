'use strict';

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

    class musicPlayer {
        constructor() {
            this.play = this.play.bind(this);
            this.playBtn = document.getElementById('play');
            this.playBtn.addEventListener('click', this.play);
            
            this.controlPanel = document.getElementById('control-panel');
            this.infoBar = document.getElementById('info');
            $('.play').click(function(){
                $(this).toggleClass('pause');
                if($(this).hasClass('pause')) {
                    $(this).closest()
                }
                else {

                }
            });
        }

        play() {
            let controlPanelObj = this.controlPanel,
            infoBarObj = this.infoBar
            Array.from(controlPanelObj.classList).find(function(element){
                        return element !== "active" ? controlPanelObj.classList.add('active') : 		controlPanelObj.classList.remove('active');
                });
            
            Array.from(infoBarObj.classList).find(function(element){
                        return element !== "active" ? infoBarObj.classList.add('active') : 		infoBarObj.classList.remove('active');
                });
        }
    }

    const newMusicplayer = new musicPlayer();
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
function retriveAudioFile(req_file_id){
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