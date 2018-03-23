
function docReady(){
"use strict";

/*==================================================================
[ Validate ]*/
var input = $('.login_validate-input .login_input');

var box = document.querySelector('.login_site').children[0],
            panelClassName = 'show-front',
onButtonClick = function( event ){
  box.removeClassName( panelClassName );
  panelClassName = event.target.className;
  box.addClassName( panelClassName );
};
$('.login_site').hide();
$('#email_container').hide();
$('#password_container').hide();
$("#login_button_container").hide();
$('#login_title').hide();
$('#login_facebook_container').hide();
$('.login_site').fadeIn(1300);
$('#login_title').show("slide", { direction: "up" },1000, {duration:"slow", easing:'ease-in'});
$('#login_facebook_container').show("slide", { direction: "up" },1000, {duration:"slow",easing:'ease-in'});
$('#email_container').show("slide", { direction: "left" }, 1000, {duration:"slow", easing:'ease-in'});
$('#password_container').show("slide", { direction: "right" },1000,  {duration:"slow", easing:'ease-in'});
$("#login_button_container").show("slide", { direction: "down" },1000,  {duration:"slow", easing:'ease-in'});

$('#login_arrow').hover(
    function(){
        $(this).addClass('bounce');
    }, function(){
        $(this).removeClass('bounce');
    })
$('#login_arrow').click(function(){
    $('#cube').addClass('show-right');
    $('#cube').removeClass('show-front');    
    // $(".login_site").fadeTo(1000, 0.1, function(){
    //     $(".login_site").fadeTo(1000, 1);
    // });
})
$('#login_arrow-create-account').hover(
    function(){
        $(this).addClass('bounce');
    }, function(){
        $(this).removeClass('bounce');
    })
$('#login_arrow-create-account').click(function(){
    $('#cube').addClass('show-front');
    $('#cube').removeClass('show-right');    
    // $(".login_site").fadeTo(1000, 0.1, function(){
    //     $(".login_site").fadeTo(1000, 1);
    // });
})



$('.login_validate-form').on('submit',function(){
    var check = true;

    for(var i=0; i<input.length; i++) {
        if(validate(input[i]) == false){
            showValidate(input[i]);
            check=false;
        }
    }
    return check;
});


$('.login_validate-form .login_input').each(function(){
    $(this).focus(function(){
        hideValidate(this);
    });
});


function validate (input) {
    if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return false;
        }
    }
    else {
        if($(input).val().trim() == ''){
            return false;
        }
    }
}

function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('login_alert-validate');
}

function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('login_alert-validate');
}

/*==================================================================
[ Show pass ]*/
var showPass = 0;
$('.login_btn-show-pass').on('click', function(){
    if(showPass == 0) {
        $(this).next('input').attr('type','text');
        $(this).find('i').removeClass('fa-eye');
        $(this).find('i').addClass('fa-eye-slash');
        showPass = 1;
    }
    else {
        $(this).next('input').attr('type','password');
        $(this).find('i').removeClass('fa-eye-slash');
        $(this).find('i').addClass('fa-eye');
        showPass = 0;
    }
    
});
};

var siteW = $(window).width();
var siteH = $(window).height();

TweenMax.set(".login_site", { perspective: 5000 });
TweenMax.set(".login_container", {
  transformStyle: "preserve-3d",
  transformOrigin: "-0% 50%"
});
TweenMax.set("#page_2", { rotationY: 90, z: -siteW / 2, x: siteW / 2 });

function changeContent(){
    var tlFlip = new TimelineMax({
        yoyo: false,
        delay: 1.5,
        repeatDelay: 2
      });
      
      tlFlip
        .to(".login_site", 0.5, { scale: 0.8, ease: Power2.easeInOut }, "start")
        .to(
          ".login_container",
          0.4,
          { rotationY: -90, z: -siteW, ease: Power2.easeInOut },
          "start+=0.7"
        )
        .to(".login_site", 0.5, { scale: 1, ease: Power2.easeInOut }, "start+=1.2");
}

