var sideNav = $('.nav__list');
var burger = $('.bar-split');
var friends = $('.friends-list_title_cell');
var friends_active = true;
var panel = $('.panel');
var user_id;

var init = function(name){
    var url = new URL(window.location.href);
    if(!IS_NULL(url.searchParams.get("user_id"))){
      user_id = url.searchParams.get("user_id")
    }
    $('.sidepanel_body').fadeOut({duration:0, complete:function(){
      $('.sidepanel_body').fadeIn({duration: 2000})
    }});
    
    initNavLinks();

    burger.click(function(){
      toggleSideNav();
    })

    friends.click(function(){
      toggleFriendsList();
    })

}

var toggleFriendsList = function(){
  if(friends_active)
    $('.friends-list_cell').slideUp();
  else 
    $('.friends-list_cell').slideDown();
  friends_active = !friends_active;
  
}

var toggleSideNav = function() {
  $('.sidepanel_title').toggleClass('title--nav_active');
  burger.toggleClass('burger--active');
  sideNav.toggleClass('nav__list--active');
}

var toggleNav = function (){
  $("#sidepanel_index_button").toggleClass('open');
  if($(".sidepanel_index-button-container").attr("data-index-open") === "false"){
      $(".sidepanel_index-title").children("span").stop().animate({backgroundColor:'#854442'}, 300);
      // openNav();
      $(".sidepanel_index-button-container").attr("data-index-open","true");
      $(".sidepanel_index-title").toggleClass("container-closed");
  }
  else {
    $(".sidepanel_index-title").children("span").stop().animate({backgroundColor:'#854442'}, 300);
      // openNav();
      $(".sidepanel_index-button-container").attr("data-index-open","true");
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
  $(".sidepanel_index_item_H").each( function(indexa){
    $(this).show("slide", "swing", indexa * 300);
  });
  $(".sidepanel_index_item").each( function(index){
    $(this).show("slide", "swing", index * 200);
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
    
      retrieveId(function(userid){
        $('#page_1').fadeOut('slow', function(){
          $('#page_1').empty();
          $('#page_1').load("../views/webcam.html");
          var url = new URL(window.location.href);
          user_id = url.searchParams.get("user_id");
          console.log("IS"+user_id);
          changeurl('webcam?user_id='+user_id);
          $('#page_1').fadeIn('slow');
        });
    });
  })
  $('#profile_link').on('click', function(){
    loadMyProfilePage();
  })
  $('#create_link').click(function(){
    $('#page_1').fadeOut('slow', function(){
      $('#page_1').empty();
      $('#page_1').load("../views/create.html");
      $('#page_1').fadeIn({duration: 'slow', complete: function(){
        fadeInArrow();
      }});
      
    });
  })
  $('#explore_link').click(function(){
    $('#page_1').fadeOut('slow', function(){
      $('#page_1').empty();
      $('#page_1').load("../views/explore.html");
      $('#page_1').fadeIn('slow');
    });
  })
  $('#logout_link').click(function(){
    $('.sidepanel_body').fadeOut('slow', function(){
        location.href="http://localhost:3000/login";
    });
  })
  $('#chat_link').click(function(){
    connectWS_debug_link();
  })
  $('.friend_tab_name').click(function(){
    loadOtherProfilePage($(this).attr('data-friend-id'));
  })
}

var refreshTab = function(){
  var activetab = $('.sidepanel_menu_link.active')
  if(activetab.length){
    activetab.trigger('click');
  }
}

var siteW = $(window).width();
var siteH = $(window).height();

TweenMax.set(".login_site", { perspective: 5000 });
TweenMax.set(".login_container", {
  transformStyle: "preserve-3d",
  transformOrigin: "-0% 50%"
});
TweenMax.set("#page_2", { rotationY: 90, z: -siteW / 2, x: siteW / 2 });

var transitionToProfilePage = function (){
  $('#page_1').fadeOut('slow', function(){
    $('#page_1').empty();
    $('#page_1').load("../views/profile.html");
    $('#page_1').fadeIn('slow');
  });
}

var changeContent = function (){
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
var loadMyProfilePage = function (){
  // $('#page_1').fadeOut('slow');
  $.ajax({
    url: '/myprofile',
    type: 'GET',
    processData: false,
    contentType: false,
    success: function(data){
      $('#page_1').html(data);
      // $('#page_1').fadeIn('slow');
    }
  });
}
var loadOtherProfilePage = function(user_id){
  console.log("HELLO");
  $('#page_1').fadeOut('slow', function(){
    $('#page_1').empty();
    $.ajax({
      url: '/profile',
      type: 'GET',
      data: {'user_id': user_id},
      success: function(data){
        $('#page_1').html(data);
        $('#page_1').fadeIn('slow');
      }
    });
  });


}

function IS_NULL(x){
  return (x === undefined || x === null || x === NaN); //util.isNullOrUndefined(x) || isNaN(x))
}

var retrieveId = function(callback){
  $.ajax({
    url: '/whatsmyid',
    type: 'POST',
    success: function(data){
        dataObj = data;
        console.log("got " + data);
        callback(dataObj.user_id);
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
          return true;
      },
      error: function(xhr, ajaxOptions, thrownError){
          console.log("ERROR!");
          return false;
      }
  });
}