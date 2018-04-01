
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
    })

    $('#create_account_password2').on('input',function(e){
        if(password_gradient != false){
            clearInterval(password_gradient);
            $('#create_account_password2').css({'background':'white'});
            password_gradient = false;
        }
    })


    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.login_btn-show-pass').on('click', function(){
        hidePass();
    });

    $('#sign_up_btn').click(function(){
        submitAccount();
    })
    $('#login_btn').click(function(){
        submitLogin();
    })
};

var password_gradient = false;

var submitAccount = function(){
    if($('#create_account_password1').val() != $('#create_account_password2').val()){
        password_gradient = setInterval(updateGradient, 20);
    }
    else{
        var firstname  = $('#create_account_firstname').val();
        var surname = $('#create_account_surname').val();
        var email = $('#create_account_email').val();
        var pass = $('#create_account_password1').val();
        $.ajax({
            url: '/login/submit_account',
            type: 'POST',
            dataType: "json",
            data: {firstname:firstname, surname:surname, email:email, password:pass},
            success: function(data){
                console.log(data);
                console.log("OK!");
                return true;
            },
            error: function(xhr, ajaxOptions, thrownError){
                console.log("ERROR");
                return false;
            }
        });
    }
}

var submitLogin = function(){
    var email = $('#login_email').val();
    var pass = $('#login_pass').val();
    console.log(email + pass);
    var form = {email:email, password:pass};
    // var data_str = JSON.stringify(form);
    $.ajax({
        url: '/login/submit_login',
        type: 'POST',
        dataType: "json",
        data: {email:email, password:pass},
        success: function(data){
            return true;
        },
        error: function(xhr, ajaxOptions, thrownError){
            return false;
        }
    });
    
}

var colors = new Array(
    [128,62,62],
    [110,62,50],
    [137,62,70],
    [148,66,60]);
  
var step = 0;
var colorIndices = [0,1,2,3];

//transition speed
var gradientSpeed = 0.005;
  
function updateGradient()
{

    if ( $===undefined ) return;

    var c0_0 = colors[colorIndices[0]];
    var c0_1 = colors[colorIndices[1]];
    var c1_0 = colors[colorIndices[2]];
    var c1_1 = colors[colorIndices[3]];

    var istep = 1 - step;
    var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    var color1 = "rgb("+r1+","+g1+","+b1+")";

    var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    var color2 = "rgb("+r2+","+g2+","+b2+")";

    $('#create_account_password2').css({
        background: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"}).css({
        background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"});

    step += gradientSpeed;
    if ( step >= 1 )
    {
        step %= 1;
        colorIndices[0] = colorIndices[1];
        colorIndices[2] = colorIndices[3];
        
        //pick two new target color indices
        //do not pick the same as the current one
        colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
        colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
        
    }
}


var siteW = $(window).width();
var siteH = $(window).height();

function hidePass(){
    if(showPass == 0) {
        $('.login_btn-show-pass').next('input').attr('type','text');
        $('.login_btn-show-pass').find('i').removeClass('fa-eye');
        $('.login_btn-show-pass').find('i').addClass('fa-eye-slash');
        showPass = 1;
    }
    else {
        $('.login_btn-show-pass').next('input').attr('type','password');
        $('.login_btn-show-pass').find('i').removeClass('fa-eye-slash');
        $('.login_btn-show-pass').find('i').addClass('fa-eye');
        showPass = 0;
    }
}

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

