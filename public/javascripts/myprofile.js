
var page_init = false;
var init = function(){
    loadMyProfile();
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
        $('#profile_img').on('click', function(){
            document.getElementById('profile_put_file').click();
        });
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
}

var flipProfileImg = function(){
    $("#profile_card").toggleClass("flipped");
    $(".profile_card").animate({"left":"45vw"}, {duration:1100});
    $('.profile_title').removeClass('profile_title_middle').addClass('profile_title_active');
    $(".profile_card").animate({"left":"15vw"}, {duration:1100, complete:function(){
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
var loadMyProfile = function(){
    $.ajax({
        url: '/myprofile/loadmyprofile',
        type: 'POST',
        data: {},
        success: function(data){
            console.log('message sent\n');
            var profile_obj = JSON.parse(data);
            $('#profile_name').text(profile_obj.firstname + profile_obj.surname);
            $('#profile_email').text(profile_obj.email);
            $('#profile_whatido').text(profile_obj.occupation);
            $('#profile_aboutme').text(profile_obj.description);
            $('.profile_img').css({background: 'url(' + profile_obj.profile_picture + ')','background-size': 'contain'});
           
        },
        error(){
            console.log("ERROR in loading profile");
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