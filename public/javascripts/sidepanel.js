
function init(content){
  
    toggleNav();
    $('.sidepanel_menu_link').click(function(){
      $('.sidepanel_menu_link.active').removeClass("active");
      $(this).addClass('active');
    })
    $('.sidepanel_menu-link-right').click(function(){

      $('#page_1').fadeOut('slow', function(){
        $('#page_1').load("../views/profile.html")
        $('#page_1').fadeIn('slow');
      });

    })
    $('.sidepanel_menu-link-left').click(function(){
      $('#page_1').fadeOut('slow', function(){
        $('#page_1').load("../views/home.html")
        $('#page_1').fadeIn('slow');
      });
  
    })
    $('.sidepanel_menu-link-mid').click(function(){
      $('#page_1').fadeOut('slow', function(){
        $('#page_1').load("../views/explore.html")
        $('#page_1').fadeIn('slow');
      });
    })
    $('.sidepanel_menu-link-login').click(function(){
      $('#page_1').fadeOut('slow', function(){
      $('#page_1').load("../views/login.html")
      $('#page_1').fadeIn('slow');
      });
    })
    
    burger.click(function(){
      openMenu();
    });
    
}
var menu = $('.nav__list');
var burger = $('.burger');
var panel = $('.panel');
  
var openMenu = function() {
  burger.toggleClass('burger--active');
  menu.toggleClass('nav__list--active');
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