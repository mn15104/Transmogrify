
var page_init = false;
var all_images_loaded = false;
var init = function(){
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
    retrieveFileData(20, 'max');
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
        animateIntro();
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
    $('#profile_put_file').on('change' ,function(){
        uploadProfilePicture();
    })

    $('#profile_occupation_pencil').click(function(){
        if(!$(this).hasClass('occupation_edit')){
            $('#occupation_box').addClass('editable');
            $('#profile_occupation_text').attr('contenteditable', 'true');  
            $(this).toggleClass('occupation_edit');
        }
        else{
            $('#occupation_box').removeClass('editable');
            $('#profile_occupation_text').attr('contenteditable', 'false');  
            $(this).toggleClass('occupation_edit');
        }
    });
    $('#profile_description_pencil').click(function(){
        if(!$(this).hasClass('description_edit')){
            $('#description_box').addClass('editable');
            $('#profile_description_text').attr('contenteditable', 'true');  
            $(this).toggleClass('description_edit');
        }
        else{
            $('#description_box').removeClass('editable');
            $('#profile_description_text').attr('contenteditable', 'false');  
            $(this).toggleClass('description_edit');
        }
    });

    setInterval(updateBlur, 1000);
}

var animateIntro = function(){
    $("#profile_card").toggleClass("flipped");
    $(".profile_card").animate({"left":"300%"}, {duration:1100});
    $('.profile_title').removeClass('profile_title_middle').addClass('profile_title_active');
    $(".profile_card").animate({"left":"100%"}, {duration:1100, complete:function(){
        $('#profile_profile-description').slideDown(600,false, function(){
            $(".profile_gallery-wrapper").fadeIn('slow');
            $('#profile_put_file').prop('disabled', false);
        });
    }});
    $("#sidebar-horizontal").fadeIn("slow");
}

var flipProfileCard = function(){
    if(!$('#profile_card').hasClass('flipped')){
        $("#profile_card").toggleClass("flipped");
        $('.profile_profile-settings').css('z-index','0');
        $('.profile_profile-settings').animate({opacity: 1}, {duration: 1300, queue: false});
    }
    else{     
        $("#profile_card").toggleClass("flipped");
        $('.profile_profile-settings').css('z-index','-1');
        $('.profile_profile-settings').animate({opacity: 0}, {duration: 1300, queue: false});
    }
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

var uploadProfilePicture = function(){

    var formData = new FormData();


    formData.append("file",$('#profile_put_file')[0].files[0]);
    formData.append("upload_file",true);
    

    $.ajax({
        type: "POST",
        url: "/myprofile/uploadprofilepicture",
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            console.log("success");
        },
        error: function(err){
            console.log("error");
        }
    });
}


$('#upload-input').on('change', function(){
    var files = $(this).get(0).files;
    reader.readAsDataURL(input.files[0]);
    if (files.length > 0){
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      var formData = new FormData();
  
      // loop through all the selected files and add them to the formData object
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
  
        // add the files to formData object for the data payload
        formData.append('uploads[]', file, file.name);
      }
  
      $.ajax({
        url: '/home/drag/uploadAudio',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();
  
          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {
  
  
            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);
  
              // update the Bootstrap progress bar with the new percentage
              $('.progress-bar').text(percentComplete + '%');
              $('.progress-bar').width(percentComplete + '%');
  
              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $('.progress-bar').html('done');
              }
            }
  
          }, false);
  
          return xhr;
        }
      });
  
    }
});
var loadChatHistory = function(){
    $.ajax({
        url: '/myprofile/chat/loadhistory',
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
        url: '/myprofile/chat/send',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('message sent\n' + data);
        }
      });
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
function retrieveFileData(numb, req_file_id){
    $.ajax({
        url: '/myprofile/loadfile',
        type: 'POST',
        data: {'num_files' : numb,
               'pair_id': req_file_id},
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