



// $(".index_item, .index_item_H").click(function(event){
//     event.preventDefault();
//     linkLocation = this.href;
//     $("body").fadeOut(2000, redirectPage(linkLocation));      
// });
     
// function redirectPage(linkLocation) {
//     window.location = linkLocation;
// }
function init(urlpath){
    $("#page_1").load(urlpath);
    // $("#page_2").load("../views/login.html");
    $('.link').click(function(){
        changeContent();
    })
    toggleNav();
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
        .to(".site", 0.5, { scale: 0.8, ease: Power2.easeInOut }, "start")
        .to(
          ".container",
          0.4,
          { rotationY: -90, z: -siteW, ease: Power2.easeInOut },
          "start+=0.7"
        )
        .to(".site", 0.5, { scale: 1, ease: Power2.easeInOut }, "start+=1.2");
}


function toggleNav(){
  $("#index_button").toggleClass('open');
  if($(".index-button-container").attr("data-index-open") === "false"){
      $(".index-title").children("span").stop().animate({backgroundColor:'#854442'}, 300);
      openNav();
      $(".index-button-container").attr("data-index-open","true");
      $(".index-title").toggleClass("container-closed");
  }
  else {
      $(".index-title").children("span").stop().animate({backgroundColor:'#bd4242'}, 100);
      closeNav();
      $(".index-button-container").attr("data-index-open","false");
      $(".index-title").toggleClass("container-closed");
  }
}

function openNav() {
    var window_height = $(window).height();

    $("#main_content").fadeTo("slow", 0.5);
    slideIndexItemsRight();
    $("#index_content").animate({height:window_height}, "medium", function(){
      $("#index_content").animate({width:"1500px"}, "medium", function(){
   
      });
    });
}

function closeNav() {
    var window_height = $(window).height(); 
    slideIndexItemsLeft();
    $("#main_content").fadeTo("slow", 0.9);
    $("#index_content").animate({height:"200px"}, "medium", function(){
      $("#index_content").animate({width:"200px"}, "medium", function(){
       
      });
    });
  
  }

function slideIndexItemsRight(){
  var len = $(".nav").children().length; 

  $(".index_item").each( function(index){
    $(this).show("slide", "swing", index * 300);
  });
  $(".index_item_H").each( function(indexa){
    $(this).hide("slide", "swing", indexa * 200);
  });
}

function slideIndexItemsLeft(){

  $(".index_item").each( function(index){
    $(this).hide("slide", "swing", index * 200);
  });
  $(".index_item_H").each( function(indexa){
    $(this).show("slide", "swing", indexa * 200);
  });
}