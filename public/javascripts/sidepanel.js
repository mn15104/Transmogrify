



// $(".index_item, .index_item_H").click(function(event){
//     event.preventDefault();
//     linkLocation = this.href;
//     $("body").fadeOut(2000, redirectPage(linkLocation));      
// });
     
// function redirectPage(linkLocation) {
//     window.location = linkLocation;
// }


function init(content){
    //$("#page_1").load(urlpath);
    //$("#page_2").load("../views/login.html");
    // if(content){
    //   $("#page-1").load(content);
    // }
    // $('.link').click(function(){
    //     changeContent();
    // })
    toggleNav();
    $('.sidepanel_menu-link-right').click(function(){
      $('#page_1').load("../views/login.html")
    })
}

var siteW = $(window).width();
var siteH = $(window).height();

TweenMax.set(".site", { perspective: 5000 });
TweenMax.set(".container", {
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
        .to(".sidepanel_site", 0.5, { scale: 0.8, ease: Power2.easeInOut }, "start")
        .to(
          ".sidepanel_container",
          0.4,
          { rotationY: -90, z: -siteW, ease: Power2.easeInOut },
          "start+=0.7"
        )
        .to(".sidepanel_site", 0.5, { scale: 1, ease: Power2.easeInOut }, "start+=1.2");
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