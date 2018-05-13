var sideNav = $('.nav__list');
var burger = $('.bar-split');
var friends = $('.friends-list_title_cell');
var friends_active = true;
var panel = $('.panel');
var user_id;

function init(name){
    console.log(name)
    if(name!='<%= name %>'){
      var imagesrc = getProfilePicture(name);
    }
    var url = new URL(window.location.href);
    if(!IS_NULL(url.searchParams.get("user_id"))){
      user_id = url.searchParams.get("user_id");
    }
    $('.sidepanel_body').fadeOut({duration:0, complete:function(){
      $('.sidepanel_body').fadeIn({duration: 2000});
    }});
    
    initNavLinks();
    burger.click(function(){
      toggleSideNav();
    });
    friends.click(function(){
      toggleFriendsList();
    })
    // $('.friends-list_name').on('click', function(){
    //   $('.friends-chat-tab').load('../views/chat.html');
    // })
}

var toggleFriendsList = function(){
  if(friends_active)
    $('.friends-list_cell').slideUp();
  else 
    $('.friends-list_cell').slideDown();
  friends_active = !friends_active;
   console.log(user_id);
}

var toggleSideNav = function() {
  $('.sidepanel_title').toggleClass('title--nav_active');
  burger.toggleClass('burger--active');
  sideNav.toggleClass('nav__list--active');
};

function toggleNav(){
  $("#sidepanel_index_button").toggleClass('open');
  if($(".sidepanel_index-button-container").attr("data-index-open") === "false"){
      $(".sidepanel_index-title").children("span").stop().animate({backgroundColor:'#854442'}, 300);
      openNav();
      $(".sidepanel_index-button-container").attr("data-index-open","true");
      $(".sidepanel_index-title").toggleClass("container-closed");
  }
  else {
      $(".sidepanel_index-title").children("span").stop().animate({backgroundColor:'#bd4242'}, 100);
      closeNav();
      $(".sidepanel_index-button-container").attr("data-index-open","false");
      $(".sidepanel_index-title").toggleClass("container-closed");
  }
}

function openNav() {
    var window_height = $(window).height();

    slideIndexItemsRight();

}

function closeNav() {
    var window_height = $(window).height(); 
    slideIndexItemsLeft();

  }

function slideIndexItemsRight(){
  var len = $(".nav").children().length; 

  $(".sidepanel_index_item").each( function(index){
    $(this).show("slide", "swing", index * 300);
  });
  $(".sidepanel_index_item_H").each( function(indexa){
    $(this).hide("slide", "swing", indexa * 200);
  });
}

function slideIndexItemsLeft(){

  $(".sidepanel_index_item").each( function(index){
    $(this).hide("slide", "swing", index * 200);
  });
  $(".sidepanel_index_item_H").each( function(indexa){
    $(this).show("slide", "swing", indexa * 200);
  });
}

var changeurl = function(url)
{
 window.history.pushState("data","Title",url);
 document.title=url;
}

var initNavLinks = function(){
  toggleNav();
  toggleFriendsList();
  
  $('.sidepanel_menu_link').click(function(){
    // Stop all audio if previous page contains an audio player
    var prevpage = $('.sidepanel_menu_link.active');
    // if(prevpage.find('#CURRENT_PLAYER')){
    //   $.getScript("explore.js",function(){             // NOT FUNCTIONAL, NEEDS CORRECTING
    //     refreshAudio();
    //   });
    // }

    prevpage.removeClass("active");
    $(this).addClass('active');
  })
  $('.sidepanel_title').click(function(){
    $('#page_1').fadeOut('slow', function(){
      $('#page_1').empty();
      $('#page_1').load("../views/webcam.html")
      changeurl('webcam');
      $('#page_1').fadeIn('slow');
    });
  })
  $('#profile_link').click(function(){
    $('#page_1').fadeOut('slow', function(){
      $('#page_1').empty();
      $('#page_1').load("../views/myprofile.html")
      changeurl('myprofile');
      $('#page_1').fadeIn('slow');
    });
  })
  $('#create_link').click(function(){
    $('#page_1').fadeOut('slow', function(){
      $('#page_1').empty();
      $('#page_1').load("../views/create.html")
      changeurl('create');
      $('#page_1').fadeIn('slow');
    });
  })
  $('#explore_link').click(function(){
    $('#page_1').fadeOut('slow', function(){
      $('#page_1').empty();
      $('#page_1').load("../views/explore.html");
      changeurl('explore');
      $('#page_1').fadeIn('slow');
    });
  })
  $('#logout_link').click(function(){
    connectWS();
  })
  $('#chat_link').click(function(){
    connectWS_debug_link();
  })
}

var siteW = $(window).width();
var siteH = $(window).height();

TweenMax.set(".login_site", { perspective: 5000 });
TweenMax.set(".login_container", {
  transformStyle: "preserve-3d",
  transformOrigin: "-0% 50%"
});
TweenMax.set("#page_2", { rotationY: 90, z: -siteW / 2, x: siteW / 2 });

function transitionToProfilePage(){
  $('#page_1').fadeOut('slow', function(){
    $('#page_1').empty();
    $('#page_1').load("../views/profile.html");
    changeurl('explore');
    $('#page_1').fadeIn('slow');
  });
}

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

function getProfilePicture(name){
  $.ajax({
    url: '/sidepanel/getProfilePicture',
    type: 'POST',
    data: {name: name},
    processData: false,
    contentType: false,
    success: function(data){
      console.log(data)
      var f = $(self).attr("src", data); 
      console.log($(f).find('img').attr('src'));
      // $('.sidepanel_menu-link-login').replaceWith(
      //   '<img class="sidepanel_menu_link sidepanel_menu-link-login" src="'+ data + '">'
      // )
    }
  });
}
function IS_NULL(x){
  return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

var retrieveId = function(){
  $.ajax({
    url: '/whatsmyid',
    type: 'POST',
    success: function(data){
        dataObj = JSON.parse(data);
        console.log("got " + data);
        return dataObj.user_id;
    },
    error: function(xhr, ajaxOptions, thrownError){
        console.log("ERROR!");
        return null;
    }
});
}

var connectWS_debug_link = function(){
  if(IS_NULL(user_id)){
    user_id = retrieveId();
  }
  $.ajax({
      url: '/chat/connect_chat',
      type: 'POST',
      data: {user_id: user_id},
      success: function(data){
          console.log("OK!");
          console.log(data);
          $('#page_1').fadeOut('slow', function(){
            $('#page_1').empty();
            $('#page_1').load("../views/chat.html");
            $('#page_1').fadeIn('slow');
          });
          return true;
      },
      error: function(xhr, ajaxOptions, thrownError){
          console.log("ERROR!");
          return false;
      }
  });
}
var connectWS = function(){
  if(IS_NULL(user_id)){
    user_id = retrieveId();
  }
  $.ajax({
      url: '/chat/connect_chat',
      type: 'POST',
      data: {user_id: user_id},
      success: function(data){
          console.log("OK!");
          console.log(data);
          $('#page_1').fadeOut('slow', function(){
            $('#page_1').empty();
            $('#page_1').load("../views/profile.html");
            changeurl('profile?user_id='+user_id);
            $('#page_1').fadeIn('slow');
          });
          return true;
      },
      error: function(xhr, ajaxOptions, thrownError){
          console.log("ERROR!");
          return false;
      }
  });
}