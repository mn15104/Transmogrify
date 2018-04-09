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
  $("#progress-information").html("Ready to Convert?");
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
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});

$( ".convert-btn" ).one( "click", function() {

    // Create new image to get correct source image height and width
    $("<img>") // Create a new <img>
        .attr("src", $("#image_test").attr("src")) // Copy the src attr from the target <img>
            .load(function() {
                var imWidth = this.width;
                var imHeight = this.height;
                var smallWidth = 200;
                var smallHeight = 200;
                var imageScaled = false;
                // Print to console
                console.log("Width:  " + imWidth);
                console.log("Height: " + imHeight);

                // Create canvas to start inspecting image with
                var canvas = document.createElement('canvas');
                canvas.width = imWidth;
                canvas.height = imHeight;
                canvas.getContext('2d').drawImage(this, 0, 0, imWidth, imHeight);

                //Create smallerCanvas for faster computation
                if ( (imWidth > 200) || (imHeight > 200) ) imageScaled = true;
                if (imageScaled) {
                    console.log("Large image detected, scaling");
                    var smallCanvas = document.createElement('canvas');
                    smallCanvas.width = smallWidth;
                    smallCanvas.height = smallHeight;
                    smallCanvas.getContext('2d').drawImage(this, 0, 0, smallWidth, smallHeight);
                    imWidth = smallWidth;
                    imHeight = smallHeight;
                    $("#progress-information").html("Large image detected, scaling...");
                } else {
                    $("#progress-information").html("Small image detected");
                }

                // Show image to check if we need
                // var url = smallCanvas.toDataURL();
                // $('#image_test2').attr('src', url );

                //Get pixel data at specific point (for testing)
                // var pixelData = canvas.getContext('2d').getImageData(0, 0, imWidth, imHeight).data;
                // console.log('Pixel: (' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ') , alpha: [' + pixelData[3] + ']');

                // Primary colour counts
                var redCount = 0;
                var greenCount = 0;
                var blueCount = 0;

                //RGB summing for average
                var redSum = 0;
                var greenSum = 0;
                var blueSum = 0;
                var pixelSum = 0;

                //Percentage of completion for progress bar
                var percentage = 0;
                // 
                // //Binning the image
                // var noBins = 64;
                // var pixBin[noBins]; //= new Array[noBins];
                // var pixInfo = [0.0,0.0,2.0,0.0];
                // window.alert(pixInfo[0]);
                // for (var b = 0; b < noBins; b++) {
                //     pixBin[b] = pixInfo;
                // }
                //
                // window.alert(pixBin[3][2]);

                //For now we will scale ALL large images down to 200x200
                var i = 0;
                (function loop() {
                    //Keeping track of stuff
                    console.log('Loop: (' + i + ')');
                    console.log("Compare: " + ((i/imWidth)*100) + " > " + (percentage+1));

                    // Go through each pixel
                    for (var j = 0; j < imHeight; j++) {
                        if (imageScaled) {
                            pixelData = smallCanvas.getContext('2d').getImageData(i, j, imWidth, imHeight).data;
                        }
                        else {
                            pixelData = canvas.getContext('2d').getImageData(i, j, imWidth, imHeight).data;
                        }

                        //Information about pixels
                        if ( (pixelData[0] >= pixelData[1]) && (pixelData[0] >= pixelData[2]) ) redCount += 1;
                        if ( (pixelData[1] >= pixelData[0]) && (pixelData[1] >= pixelData[2]) ) greenCount += 1;
                        if ( (pixelData[2] >= pixelData[0]) && (pixelData[2] >= pixelData[1]) ) blueCount += 1;
                        redSum += pixelData[0];
                        greenSum += pixelData[1];
                        blueSum += pixelData[2];
                        pixelSum += 1;
                    }

                    //Update progress bar and reenter loop if conditions fulfilled
                    if ( ((i/imWidth)*100)>(percentage+1) ) {
                        percentage += 1;
                    }
                    i++;
                    if (i < imWidth) {
                        updateProgress(percentage);
                        setTimeout(loop, 0);
                    }
                    else {
                        var primaryDetected = colourCount(redCount, greenCount, blueCount);
                        var colourDetected = colourAverage(redSum,blueSum,greenSum,pixelSum);
                        audioTester(primaryDetected, colourDetected);
                        updateProgress(100);

                        //Show the placeholder audio
                        // $("#audio_reloader").load();
                        // $('#audio_test').show();
                        $("#image-info0").html("Playing Audio...");
                        $('#conversion-infomation').show();
                    }

                })();

    });

});

function updateProgress(percentage){
    document.getElementById("progress-bar-convert").style.width = (percentage + '%');
    document.getElementById("progress-bar-convert").innerHTML = (percentage + '%');
    if (percentage === 50) {
        $("#progress-information").html("Applying structure");
    }
    if (percentage === 75) {
        $("#progress-information").html("Applying final touches");
    }
    if (percentage === 100) {
        document.getElementById("progress-bar-convert").style.color = "#202020";
        $("#progress-information").html("Conversion Completed");
    }
}

function colourCount(redCount, greenCount, blueCount) {

    var primaryDetected = 0;
    console.log('Total Pixel Count: (' + redCount + ', ' + greenCount + ', ' + blueCount + ')');
    var newSrc = "http://www.wavlist.com/soundfx/006/horse-donkey1.wav";
    $("#audio1").attr("src", newSrc);

    if ( (redCount >= greenCount) && (redCount >= blueCount ) ){
        // var redSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-red.ogg";
        // $("#audio1").attr("src", redSrc);
        primaryDetected = 1;
        $("#image-info1").html("Primary Count: Mostly Red Pixels, Instrument Set: 1");
    }
    else if( greenCount >= blueCount){
        // var greenSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-green.ogg";
        // $("#audio1").attr("src", greenSrc);
        primaryDetected = 2;
        $("#image-info1").html("Primary Count: Mostly Green Pixels, Instrument Set: 2");
    }
    else {
        // var blueSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-blue.ogg";
        // $("#audio1").attr("src", blueSrc);
        primaryDetected = 3;
        $("#image-info1").html("Primary Count: Mostly Blue Pixels, Instrument Set: 1");
    }


    return primaryDetected;

}

function colourAverage(redSum,blueSum,greenSum,pixelSum) {
    var redAv = Math.floor(redSum/pixelSum);
    var greenAv = Math.floor(greenSum/pixelSum);
    var blueAv = Math.floor(blueSum/pixelSum);
    $("#progress-bar-convert").css("background-color", "rgb(" + redAv + "," + greenAv + "," + blueAv + ")");

    //Colour classification into 9 main colours
    var colourDetected = 0;
    //1 =    red, 2 =  green, 3 =   blue,
    //4 = yellow, 5 = orange, 6 = purple,
    //7 = white, 8 = black, 0 = unknown,
    if(redAv > 200) {
        if (greenAv > 200) {
            if (blueAv > 200) {
                colourDetected = 7; //white
            }
            else {
                colourDetected = 4; //Yellow
            }
        }
        else if (greenAv > 100 && blueAv < 100) {
            colourDetected = 5; //Orange
        }
        else if (greenAv < 100 && blueAv < 100) {
            colourDetected = 1; //Red
        }
    }
    else if (redAv > 100 && blueAv < 100 && greenAv > 200) {
        colourDetected = 6; //Purple
    }
    else if (redAv < 100 && greenAv < 100 && blueAv > 200) {
        colourDetected = 3; //Blue
    }
    else if (redAv < 100 && greenAv > 200 && blueAv < 100) {
        colourDetected = 2; //Green
    }
    else if (redAv < 100 && greenAv < 100 && blueAv < 100) {
        colourDetected = 8; //Black
    }

    //Assign audio to that colour
    if (colourDetected === 1) {
        var colourSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-red.ogg"
        $("#image-info2").html("Average Colour: Red, Key = Bb");
    }
    else if (colourDetected === 2) {
        var colourSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-green.ogg"
        $("#image-info2").html("Average Colour: Green, Key = B");
    }
    else if (colourDetected === 3) {
        var colourSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-blue.ogg"
        $("#image-info2").html("Average Colour: Blue, Key = C");
    }
    else if (colourDetected === 4) {
        var colourSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-yellow.ogg"
        $("#image-info2").html("Average Colour: Yellow, Key = Db");
    }
    else if (colourDetected === 5) {
        var colourSrc = "http://packs.shtooka.net/eng-balm-emmanuel/ogg/eng-1dc5b178.ogg"
        $("#image-info2").html("Average Colour: Orange, Key = D");
    }
    else if (colourDetected === 6) {
        var colourSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-purple.ogg"
        $("#image-info2").html("Average Colour: Purple, Key = Eb");
    }
    else if (colourDetected === 7) {
        var colourSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-white.ogg"
        $("#image-info2").html("Average Colour: White, Key = E");
    }
    else if (colourDetected === 8) {
        var colourSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-black.ogg"
        $("#image-info2").html("Average Colour: Black, Key = F");
    }
    else if (colourDetected === 0) {
        var colourSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-unknown.ogg"
        $("#image-info2").html("Average Colour: Unknown, Key = A");
    }
    //Set new audio
    $("#audio1").attr("src", colourSrc);
    return colourDetected;
}

//Cheeky global
var bpm = 10;

function audioTester(primaryDetected, colourDetected){
    //Demo
    // var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    // var audioContext = new AudioContextFunc();
    // var player=new WebAudioFontPlayer();
    // player.loader.decodeAfterLoading(audioContext, '_tone_0250_SoundBlasterOld_sf2');
    // player.queueWaveTable(audioContext, audioContext.destination, _tone_0250_SoundBlasterOld_sf2, 0, 12*4+7, 2);

    var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContextFunc();
    var player=new WebAudioFontPlayer();

    bpm = (60 + (primaryDetected*5) + (colourDetected * 4) );

    player.loader.decodeAfterLoading(audioContext, '_tone_0000_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_tone_0040_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_tone_040_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_drum_60_0_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_drum_61_0_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_drum_62_0_SBLive_sf2');

    var melodyInstrument = [_tone_0000_SBLive_sf2, _tone_0040_SBLive_sf2, _tone_0030_SBLive_sf2];
    var drumInstrument = [_drum_60_0_SBLive_sf2, _drum_61_0_SBLive_sf2, _drum_62_0_SBLive_sf2];

    var insNo = primaryDetected - 1;
    if (insNo < 0 || insNo > 2) insNo = 0;

    var musicKey = colourDetected;

    var motifMax = 10;
    var currentMotif = 0;
    var repTime = 0;
    (function repeatMotif() {

        if ( (currentMotif >= 2) && (currentMotif != 7) ) {
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 1),    9+12*3+musicKey, note(1) );
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 2),    0+12*4+musicKey, note(1) );
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 3),    2+12*4+musicKey, note(1) );
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 4),    4+12*4+musicKey, note(1) );
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 4.75), 3+12*4+musicKey, note(1/4) );
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 1),    2+12*4+musicKey, note(1) );
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 1.25), 3+12*4+musicKey, note(1/4) );
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 1.5),  2+12*4+musicKey, note(1) );
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 2.5),  0+12*4+musicKey, note(1) );
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 3.5),  9+12*3+musicKey, note(1/2) );
        player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 4),    9+12*3+musicKey, note(1) );
        }
        if ( (currentMotif >= 4) && (currentMotif != 7) ) {
            player.queueWaveTable(audioContext, audioContext.destination, drumInstrument[insNo], repTime + rhythm(0, 1),    0+12*5+musicKey, note(1) );
            player.queueWaveTable(audioContext, audioContext.destination, drumInstrument[insNo], repTime + rhythm(0, 2),    0+12*5+musicKey, note(1) );
            player.queueWaveTable(audioContext, audioContext.destination, drumInstrument[insNo], repTime + rhythm(0, 3),    0+12*5+musicKey, note(1) );
            player.queueWaveTable(audioContext, audioContext.destination, drumInstrument[insNo], repTime + rhythm(0, 4),    0+12*5+musicKey, note(1) );
            player.queueWaveTable(audioContext, audioContext.destination, drumInstrument[insNo], repTime + rhythm(1, 1),    0+12*5+musicKey, note(1) );
            player.queueWaveTable(audioContext, audioContext.destination, drumInstrument[insNo], repTime + rhythm(1, 2),    0+12*5+musicKey, note(1) );
            player.queueWaveTable(audioContext, audioContext.destination, drumInstrument[insNo], repTime + rhythm(1, 3),    0+12*5+musicKey, note(1) );
            player.queueWaveTable(audioContext, audioContext.destination, drumInstrument[insNo], repTime + rhythm(1, 4),    0+12*5+musicKey, note(1) );
        }

        if ( (currentMotif >= 6) && (currentMotif != 7) ) {
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 1),    9+12*6+musicKey, note(1) , 0.2);
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 1.5),  9+12*6+musicKey, note(1) , 0.2);
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 2),    7+12*6+musicKey, note(1) , 0.2);
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 2.5),  9+12*6+musicKey, note(1) , 0.2);
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 3.5),  7+12*6+musicKey, note(1.5) , 0.2);
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 2.95), 3+12*6+musicKey, note(1/16) , 0.2);
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 3),    4+12*6+musicKey, note(1) , 0.2);
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 3.95), 3+12*6+musicKey, note(1/16) , 0.2);
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 4),    4+12*6+musicKey, note(1) , 0.2);
        }
        if ( currentMotif >= 0) {
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 1),    9+12*3+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 1),    9+12*2+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 2),    7+12*3+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 2),    7+12*2+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 3),    5+12*3+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 3),    5+12*2+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 4),    4+12*3+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(0, 4),    4+12*2+musicKey, note(1), 0.5 );

            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 1),    9+12*3+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 1),    9+12*2+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 2),    7+12*3+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 2),    7+12*2+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 3),    5+12*3+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 3),    5+12*2+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 4),    4+12*3+musicKey, note(1), 0.5 );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 4),    4+12*2+musicKey, note(1), 0.5 );

            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 4.75), 8+12*3+musicKey, note(1/4) );
            player.queueWaveTable(audioContext, audioContext.destination, melodyInstrument[insNo], repTime + rhythm(1, 4.75), 8+12*2+musicKey, note(1/4) );
        }


        if (currentMotif < motifMax) {
            currentMotif += 1;
            console.log("repTime = " + repTime);
            repTime = (repTime + rhythm(1,4) + note(1));
            repeatMotif();
        }
    //
    })();

}

function rhythm(bar, beats) {

    // var bpm = 80;
    var timeSig = 4;

    var noBeats = (bar*timeSig + (beats-1));
    return ( noBeats*(60/bpm) );
}

function note(noteLength) {
    // var bpm = 80;
    //4 = semibreve
    //2 = minum
    //1 = crotchet
    //1/2 = quaver
    //1/4 = semiquaver

    return ( noteLength*(60/bpm) ) ;
}
