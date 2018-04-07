$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

function readURL(files) {
  if (files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          $('#image_test')
              .attr('src', e.target.result);
      };

      reader.readAsDataURL(files[0]);
  }
}

$('#upload-input').on('change', function(){
  var files = $(this).get(0).files;
  $('#container_1').fadeOut( "slow" , 0, function(){
    readURL(files);
  });
  $( "#overlay1" ).fadeTo( "slow" , 0.7, function() {
  // Animation complete.
  });
  $( ".convert-btn" ).show();
});

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
              // document.getElementById("overlay").style.opacity = "0.9";
              // document.getElementsByClassName("container2")[0].style.opacity = "1.0";
              // document.getElementById("p1").style.textAlign = "center";
              // document.getElementById("p1").style.top = "10.5%";
              // document.getElementById("p1").innerHTML = "image is <br> ready!";
              showConvert();
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});

//     $("#testing1").html("come on");
//     for(var x = 0; x < 10000000; x++) {
//         // document.getElementById("progress-bar-convert").innerHTML = 'Hello';
//         // $("#progress-bar-convert").width() = ((x/10`00) + '%')
//         document.getElementById("progress-bar-convert").style.width = ((x/100000) + '%');
//     }
// }

$( ".convert-btn" ).one( "click", function() {

    // Create new image to get correct source image height and width
    $("<img>") // Create a new <img>
        .attr("src", $("#image_test").attr("src")) // Copy the src attr from the target <img>
            .load(function() {
                var imWidth = this.width;
                var imHeight = this.height;
                // Print to console
                console.log("Width:  " + imWidth);
                console.log("Height: " + imHeight);

                // Create canvas to start inspecting image with
                var canvas = document.createElement('canvas');
                canvas.width = imWidth;
                canvas.height = imHeight;
                canvas.getContext('2d').drawImage(this, 0, 0, imWidth, imHeight);
                //Get pixel data at specific point (for testing)
                var pixelData = canvas.getContext('2d').getImageData(0, 0, imWidth, imHeight).data;
                console.log('Pixel: (' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ') , alpha: [' + pixelData[3] + ']');
                // Loop through each pixel
                var redCount = 0;
                var greenCount = 0;
                var blueCount = 0;
                var percentage = 0;

                var i = 0;
                (function loop() {
                    //Keeping track of stuff
                    console.log('Loop: (' + i + ')');
                    console.log("Compare: " + ((i/imWidth)*100) + " > " + (percentage+1));
                    if ( ((i/imWidth)*100)>(percentage+1) ) {
                        percentage += 1;
                        console.log("NOW");
                    }
                    // Do stuff
                    for (var j = 0; j < imHeight; j++) {
                        if (j == 0) {
                        }
                        pixelData = canvas.getContext('2d').getImageData(i, j, imWidth, imHeight).data;
                        if ( (pixelData[0] >= pixelData[1]) && (pixelData[0] >= pixelData[2]) ) redCount += 1;
                        if ( (pixelData[1] >= pixelData[0]) && (pixelData[1] >= pixelData[2]) ) greenCount += 1;
                        if ( (pixelData[2] >= pixelData[0]) && (pixelData[2] >= pixelData[1]) ) blueCount += 1;

                    }
                    document.getElementById("progress-bar-convert").style.width = (percentage + '%');
                    document.getElementById("progress-bar-convert").innerHTML = (percentage + '%');
                    i++;
                    if (imWidth % i === 100) {
                        // Not using that below
                        // progressbar.set(i); //updates the progressbar, even in loop
                    }
                    if (i < imWidth) {
                        setTimeout(loop, 0);
                    }

                })();

                window.alert("Finised loop");

                // for (var i = 0; i < imWidth; i++) {
                // }
                // for (var i = 0; i < imWidth; i++) {
                //     for (var j = 0; j < imHeight; j++) {
                //         if (j == 0) {
                //             console.log('Loop: (' + i + ')');
                //             console.log("Compare: " + ((i/imWidth)*100) + " > " + (percentage+1));
                //             if ( ((i/imWidth)*100)>(percentage+1) ) {
                //                 percentage += 1;
                //                 console.log("NOW");
                //                 window.requestAnimationFrame(updateProgress(percentage));
                //                 // updateProgress(percentage);
                //                 // document.getElementById("centre-convert").style.opacity = "1.0";
                //                 // var elem = document.getElementById("progress-bar-convert");
                //                 // var width = 10;
                //                 // var id = setInterval(frame, 10);
                //                 // function frame() {
                //                 //     if (width >= 100) {
                //                 //         clearInterval(id);
                //                 //     } else {
                //                 //         width++;
                //                 //         elem.style.width = width + '%';
                //                 //         elem.innerHTML = width * 1  + '%';
                //                 //     }
                //                 // }
                //                 // var elem = document.getElementById("progress-bar-convert");
                //                 // elem.style.width = 30 + '%';
                //                 // elem.innerHTML = 30  + '%';
                //             }
                //         }
                //         // console.log("(i,j) = (" + i + ',' + j + ')');
                //         pixelData = canvas.getContext('2d').getImageData(i, j, imWidth, imHeight).data;
                //         if ( (pixelData[0] >= pixelData[1]) && (pixelData[0] >= pixelData[2]) ) redCount += 1;
                //         if ( (pixelData[1] >= pixelData[0]) && (pixelData[1] >= pixelData[2]) ) greenCount += 1;
                //         if ( (pixelData[2] >= pixelData[0]) && (pixelData[2] >= pixelData[1]) ) blueCount += 1;
                //
                //     }
                // }
                console.log('Total Pixel Count: (' + redCount + ', ' + greenCount + ', ' + blueCount + ')');
                var newSrc = "http://www.wavlist.com/soundfx/006/horse-donkey1.wav";
                $("#audio1").attr("src", newSrc);


                if ( (redCount >= greenCount) && (redCount >= blueCount ) ){
                    var redSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-red.ogg";
                    $("#audio1").attr("src", redSrc);
                }
                else if( greenCount >= blueCount){
                    var greenSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-green.ogg";
                    $("#audio1").attr("src", greenSrc);
                }
                else {
                    var blueSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-blue.ogg";
                    $("#audio1").attr("src", blueSrc);
                }

                // window.alert('Test!!!');


                //Show the placeholder audio
                $("#audio_reloader").load();
                $('#audio_test').show();

    });

});



function updateProgress(percentage) {
    console.log("Updating");
    window.alert("PERCENT: " + percentage + "%");
    $("#progress-bar-convert").animate({ width: percentage }, 'slow');
    // $("#slidebottom").animate({ width: __ }, 'slow');
    // var elem = document.getElementById("progress-bar-convert");
    // var barWidth = Math.trunc( (count/max)*100);
    // console.log("percent" + barWidth);
    // elem.style.width = barWidth + '%';
    // elem.innerHTML = barWidth * 1  + '%';
}


function showConvert(){
    window.alert(Hello);

    // getimagesize(uploads[0]

}
