$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

var init_create = function(){
 
    $('.home_container').css('opacity', 0)
    .slideDown('slow')
    .animate(
    { opacity: 1 },
    { queue: false, duration: 1000 });
      

    $('.arrow_box').on('click', function(){
        $('.home_container').fadeOut({duration:1000, complete: function(){
            location.href="http://localhost:3000/intro";
        }});
    })
}

function readURL(files) {
  if (files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          $('#image_test')
              .attr('src', e.target.result);
      }

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

                //Binning the image
                var xBins = 8;
                var yBins = 8;
                var noBins = xBins * yBins;
                var xInterval = imWidth/xBins;
                var yInterval = imHeight/yBins;


                var pixBin = new Array(noBins);

                var pixInfo = [0.0, 0.0, 0.0, 1.0]; //(Red, Green, Blue, noPixels)
                var pixel4 =  [0, 0, 0, 1];

                for (var b = 0; b < noBins; b++) {
                    pixBin[b] = new Array(4);
                    for (var c = 0; c <= 3; c++) {
                    pixBin[b][c] = 0;

                    }
                }
                //
                // console.log(" -- - - - -- - -  -pixBin[0][1] = (" + pixBin[0][0] + "," + pixBin[0][1] + ","+ pixBin[0][2] + "," + pixBin[0][3] + ")");
                // console.log(" -- - - - -- - -  -pixBin[1][1] = (" + pixBin[1][0] + "," + pixBin[1][1] + ","+ pixBin[1][2] + "," + pixBin[1][3] + ")");
                // console.log(" -- - - - -- - -  -pixBin[2][1] = (" + pixBin[2][0] + "," + pixBin[2][1] + ","+ pixBin[2][2] + "," + pixBin[2][3] + ")");
                // console.log(" -- - - - -- - -  -pixBin[3][1] = (" + pixBin[3][0] + "," + pixBin[3][1] + ","+ pixBin[3][2] + "," + pixBin[3][3] + ")");
                // console.log(" -- - - - -- - -  -pixBin[4][1] = (" + pixBin[4][0] + "," + pixBin[4][1] + ","+ pixBin[4][2] + "," + pixBin[4][3] + ")");

                var curBin = 0;



                //For now we will scale ALL large images down to 200x200
                var i = 0;
                (function loop() {
                    //Keeping track of stuff
                    console.log('Loop: (' + i + ')');
                    console.log("Compare: " + ((i/imWidth)*100) + " > " + (percentage+1));

                    // Go through each pixel
                    for (var j = 0; j < imHeight; j++) {

                        curBin = findCurrentBin(i, j, xBins, yBins, xInterval, yInterval);

                        if (imageScaled) {
                            pixelData = smallCanvas.getContext('2d').getImageData(i, j, imWidth, imHeight).data;
                        }
                        else {
                            pixelData = canvas.getContext('2d').getImageData(i, j, imWidth, imHeight).data;
                        }

                        //Primary Pixel Information
                        if ( (pixelData[0] >= pixelData[1]) && (pixelData[0] >= pixelData[2]) ) redCount += 1;
                        if ( (pixelData[1] >= pixelData[0]) && (pixelData[1] >= pixelData[2]) ) greenCount += 1;
                        if ( (pixelData[2] >= pixelData[0]) && (pixelData[2] >= pixelData[1]) ) blueCount += 1;

                        //Seconary Pixel Information
                        redSum   += pixelData[0];
                        greenSum += pixelData[1];
                        blueSum  += pixelData[2];
                        pixelSum += 1;

                        //Binned Pixel Information - Beware JS has no 2d array support so this is super convoluted (took 4hrs..)
                        // console.log(" Bin = " + curBin);
                        pixel4[0] = (pixBin[curBin][0] + pixelData[0]);
                        pixel4[1] = (pixBin[curBin][1] + pixelData[1]);
                        pixel4[2] = (pixBin[curBin][2] + pixelData[2]);
                        pixel4[3] = (pixBin[curBin][3] +      1      );
                        pixBin[curBin][0] = pixel4[0];
                        pixBin[curBin][1] = pixel4[1];
                        pixBin[curBin][2] = pixel4[2];
                        pixBin[curBin][3] = pixel4[3];
                        // console.log("pixBin[" + curBin + "] = (" + pixBin[curBin][0] + "," + pixBin[curBin][1] + "," + pixBin[curBin][2] + "," + pixBin[curBin][3] + ")");

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
                        var symmetry = colourBinned(pixBin, xBins, yBins);

                        var decision1 = Math.floor( (redSum/pixelSum) / 23.3 );
                        var decision2 = Math.floor( (greenSum/pixelSum) / 23.3 );
                        var decision3 = Math.floor( (blueSum/pixelSum) / 23.3 );
                        var decision4 = Math.abs( decision1 - decision2 );

                        audioTester(primaryDetected, colourDetected, decision1, decision2, decision3, decision4, symmetry[0], symmetry[1], symmetry[2], symmetry[3]);
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
        $("#image-info1").html("RGB Count: Mostly Red Pixels, Instrument Set: 1");
    }
    else if( greenCount >= blueCount){
        // var greenSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-green.ogg";
        // $("#audio1").attr("src", greenSrc);
        primaryDetected = 2;
        $("#image-info1").html("RGB Count: Mostly Green Pixels, Instrument Set: 2");
    }
    else {
        // var blueSrc = "http://packs.shtooka.net/eng-wcp-us/ogg/En-us-blue.ogg";
        // $("#audio1").attr("src", blueSrc);
        primaryDetected = 3;
        $("#image-info1").html("RGB Count: Mostly Blue Pixels, Instrument Set: 3");
    }


    return primaryDetected;

}

function colourAverage(redSum,blueSum,greenSum,pixelSum) {
    var redAv = Math.floor(redSum/pixelSum);
    var greenAv = Math.floor(greenSum/pixelSum);
    var blueAv = Math.floor(blueSum/pixelSum);
    $("#progress-bar-convert").css("background-color", "rgb(" + redAv + "," + greenAv + "," + blueAv + ")");

    var colourDetected = colourQuery(redAv, greenAv, blueAv);

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
function colourQuery(red, green, blue) {

    //Colour classification into 9 main colours
    var colourDetected = 0;
    //1 =    red, 2 =  green, 3 =   blue,
    //4 = yellow, 5 = orange, 6 = purple,
    //7 = white, 8 = black, 0 = unknown,
    if(red > 180) {
        if (green > 180) {
            if (blue > 180) {
                colourDetected = 7; //white
            }
            else {
                colourDetected = 4; //Yellow
            }
        }
        else if (green > 100 && blue < 100) {
            colourDetected = 5; //Orange
        }
        else if (green < 100 && blue < 100) {
            colourDetected = 1; //Red
        }
    }
    else if (red > 100 && blue < 100 && green > 180) {
        colourDetected = 6; //Purple
    }
    else if (red < 100 && green < 100 && blue > 180) {
        colourDetected = 3; //Blue
    }
    else if (red < 100 && green > 180 && blue < 100) {
        colourDetected = 2; //Green
    }
    else if (red < 100 && green < 100 && blue < 100) {
        colourDetected = 8; //Black
    }

    return colourDetected;
}

function findCurrentBin(i, j, xBins, yBins, xInterval, yInterval) {

    var xPoint = Math.floor((i) / xInterval);
    // console.log("i = " + i + ". interval = " + xInterval + ". xPoint = " + xPoint);
    var yPoint = Math.floor((j) / yInterval);
    // console.log("j = " + j + ". interval = " + yInterval + ". yPoint = " + yPoint);

    var current = (xPoint*yBins)+yPoint;
    // console.log("Pixels(" + i + "," + j + ") = " + current);
    return current;
}

function colourBinned(sumPixel, xBins, yBins) {
/* - Ordering of Bins - */
/*  - 1- -5- - 9- -13-  */
/*  - 2- -6- -10- -14-  */
/*  - 3- -7- -11- -15-  */
/*  - 4- -8- -12- -16-  */
    var avPixel = sumPixel;
    for (var i = 0; i < (xBins*yBins); i++) {
        avPixel[i][0] = Math.floor(sumPixel[i][0]/sumPixel[i][3]);
        avPixel[i][1] = Math.floor(sumPixel[i][1]/sumPixel[i][3]);
        avPixel[i][2] = Math.floor(sumPixel[i][2]/sumPixel[i][3]);
        console.log("-----------");
        console.log("avPixel[" + i + "] = (" + avPixel[i][0] + "," + avPixel[i][1] + "," + avPixel[i][2] + ")");
        console.log("sumPixel[" + i + "] = (" + sumPixel[i][0] + "," + sumPixel[i][1] + "," + sumPixel[i][2] + "," + sumPixel[i][3] + ")");
        console.log("-----------");
    }


    var indC1;
    var indC2;

    var clrComp1;
    var clrComp2;

    var fineR = 0.0;
    var fineG = 0.0;
    var fineB = 0.0;

    //Symmetry in Y
    var yClrSymmetry = 0;
    var yFineSymmetry = 0;

    for (var i = 0; i < (xBins/2); i++) {
        for (var j = 0; j < yBins; j++) {
            indC1 = (i*yBins)+j;
            indC2 = ((xBins-1-i)*yBins)+j;
            // console.log("C1 + C2 = (" + indC1 + "," + indC2 + ")");
            clrComp1 = colourQuery(avPixel[indC1][0], avPixel[indC1][1], avPixel[indC1][2]);
            clrComp2 = colourQuery(avPixel[indC2][0], avPixel[indC2][1], avPixel[indC2][2]);
            if (clrComp1 === clrComp2) yClrSymmetry += 1;

            fineR += fineSimilarity(avPixel[indC1][0], avPixel[indC2][0]);
            fineG += fineSimilarity(avPixel[indC1][1], avPixel[indC2][1]);
            fineB += fineSimilarity(avPixel[indC1][2], avPixel[indC2][2]);
            yFineSymmetry = (fineR + fineG + fineB);
            console.log("yFineSymmetry of (" + indC1 + "," + indC2 + ") is " + yFineSymmetry);
        }
    }
    yClrSymmetry = (((2*yClrSymmetry)/(xBins*yBins))*100);
    yClrSymmetry = Math.round(yClrSymmetry * 100) / 100;
    $("#image-info3").html("Colour Symmetry in Y: " + yClrSymmetry + "%");

    yFineSymmetry = (((2*yFineSymmetry)/(xBins*yBins*3))*100);
    yFineSymmetry = Math.round(yFineSymmetry * 100) / 100;
    $("#image-info4").html("Fine Symmetry in Y: " + yFineSymmetry + "%");

    //Symmetry in X
    var xClrSymmetry = 0;
    var xFineSymmetry = 0;

    fineR = 0.0;
    fineG = 0.0;
    fineB = 0.0;

    for (var i = 0; i < xBins; i++) {
        for (var j = 0; j < (yBins/2); j++) {
            indC1 = (i*xBins)+j;
            indC2 = (i*xBins)+(yBins-1-j);
            // console.log("C1 + C2 = (" + indC1 + "," + indC2 + ")");

            clrComp1 = colourQuery(avPixel[indC1][0], avPixel[indC1][1], avPixel[indC1][2]);
            clrComp2 = colourQuery(avPixel[indC2][0], avPixel[indC2][1], avPixel[indC2][2]);
            if (clrComp1 === clrComp2) xClrSymmetry += 1;

            fineR += fineSimilarity(avPixel[indC1][0], avPixel[indC2][0]);
            fineG += fineSimilarity(avPixel[indC1][1], avPixel[indC2][1]);
            fineB += fineSimilarity(avPixel[indC1][2], avPixel[indC2][2]);
            xFineSymmetry = (fineR + fineG + fineB);
        }
    }
    xClrSymmetry = (((2*xClrSymmetry)/(xBins*yBins))*100);
    xClrSymmetry = Math.round(xClrSymmetry * 100) / 100;
    $("#image-info5").html("Colour Symmetry in X: " + xClrSymmetry + "%");

    xFineSymmetry = (((2*xFineSymmetry)/(xBins*yBins*3))*100);
    xFineSymmetry = Math.round(xFineSymmetry * 100) / 100;
    $("#image-info6").html("Fine Symmetry in X: " + xFineSymmetry + "%");

    return [yClrSymmetry, yFineSymmetry, xClrSymmetry, xFineSymmetry];
}

function fineSimilarity (intA, intB){

    var diff = Math.abs(intA-intB);
    diff = 255 - diff;
    var score = diff/255;
    similarity = (score * score);

    return similarity
}


//Cheeky global
var bpm = 10;

var musicVariables = new Array(10);


$( ".download-btn" ).on( "click", function() {

    // image uploaded
    var formData = new FormData();


    formData.append("file",$('#upload-input')[0].files[0]);
    formData.append("upload_file",true);
    music_vars =
    {
        'primaryDetected' : musicVariables[0],
        'colourDetected' : musicVariables[1],
        'decision1' : musicVariables[2],
        'decision2' : musicVariables[3],
        'decision3' : musicVariables[4],
        'decision4' : musicVariables[5],
        'yClrSym' : musicVariables[6],
        'yFineSym' : musicVariables[7],
        'xClrSym' : musicVariables[8],
        'xFineSym' : musicVariables[9]
    }
    // audio vars
    music_vars =
    {
        'primaryDetected' : musicVariables[0],
        'colourDetected' : musicVariables[1],
        'decision1' : musicVariables[2],
        'decision2' : musicVariables[3],
        'decision3' : musicVariables[4],
        'decision4' : musicVariables[5],
        'yClrSym' : musicVariables[6],
        'yFineSym' : musicVariables[7],
        'xClrSym' : musicVariables[8],
        'xFineSym' : musicVariables[9]
    }
    $.ajax({
        type: "POST",
        url: "/create/uploadimage",
        data : formData,
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            $.ajax({
                url: '/create/uploadaudio',
                type: 'POST',
                data: music_vars,
                success: function(data){
                    console.log('message sent\n' + data);
                },
                error: function(){
                    alert("You need to be logged in, to save a creation.");
                }
            });
        },
        error: function(err){
            console.log("error");
        }
    });


});

$( ".retry-btn" ).one( "click", function() {
    refreshTab();
    stopAudio();
})
$( ".audiostop-btn" ).one( "click", function() {
    stopAudio();
});


var player=new WebAudioFontPlayer();

function audioTester(primaryDetected, colourDetected, decision1, decision2, decision3, decision4, yClrSym, yFineSym, xClrSym, xFineSym){
    console.log(typeof(yClrSym));
    //Demo
    // var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    // var audioContext = new AudioContextFunc();
    // var player=new WebAudioFontPlayer();
    // player.loader.decodeAfterLoading(audioContext, '_tone_0250_SoundBlasterOld_sf2');
    // player.queueWaveTable(audioContext, audioContext.destination, _tone_0250_SoundBlasterOld_sf2, 0, 12*4+7, 2);

    //Saving variables for later
    musicVariables[0] = primaryDetected;
    musicVariables[1] = colourDetected;
    musicVariables[2] = decision1;
    musicVariables[3] = decision2;
    musicVariables[4] = decision3;
    musicVariables[5] = decision4;
    musicVariables[6] = yClrSym;
    musicVariables[7] = yFineSym;
    musicVariables[8] = xClrSym;
    musicVariables[9] = xFineSym;




    var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContextFunc();



    bpm = 80;//(60 + (primaryDetected*5) + (colourDetected * 4) );

    player.loader.decodeAfterLoading(audioContext, '_tone_0490_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_tone_0040_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_tone_0000_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_tone_040_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_tone_0001_FluidR3_GM_sf2_file');

    player.loader.decodeAfterLoading(audioContext, '_drum_60_0_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_drum_61_0_SBLive_sf2');
    player.loader.decodeAfterLoading(audioContext, '_drum_62_0_SBLive_sf2');

    // player.loader.decodeAfterLoading(audioContext, '_tone_0490_SBLive_sf2');

    player.loader.waitLoad(function(){
        console.log('Instruments Ready');
    });

    var melInst = [_tone_0000_SBLive_sf2, _tone_0001_FluidR3_GM_sf2_file, _tone_0000_SBLive_sf2, _tone_0040_SBLive_sf2]; //Melody Instrument
    var drmInst = [_drum_60_0_SBLive_sf2, _drum_61_0_SBLive_sf2, _drum_62_0_SBLive_sf2]; //Drum Instrument
    var higInst = [_tone_0490_SBLive_sf2, _tone_0000_SBLive_sf2]; //High Accompaniment

    var insNo = primaryDetected - 1;
    if (insNo < 0 || insNo > 2) insNo = 0;

    var musicKey = colourDetected;
    var mood = 8 - colourDetected;

    var motifMax = 10;
    var currentMotif = 0;
    var repTime = 0;

    var symVars = new Array(4);
    symVars[0] = yClrSym/10;
    symVars[1] = yFineSym/10;
    symVars[2] = xClrSym/10;
    symVars[3] = xFineSym/10;

    var decVars = new Array(4);
    decVars[0] = decision1;
    decVars[1] = decision2;
    decVars[2] = decision3;
    decVars[3] = decision4;

    console.log("decision1 = ", decision1);
    console.log("decision2 = ", decision2);
    console.log("decision3 = ", decision3);
    console.log("decision4 = ", decision4);
    console.log("symmetry1 = ", yClrSym);
    console.log("symmetry2 = ", yFineSym);
    console.log("symmetry3 = ", xClrSym);
    console.log("symmetry4 = ", xFineSym);

    motif = motifGenerator(mood, 1, 0, decVars, symVars);
    bass = bassGenerator(mood, 1, 0, decVars, symVars, motif);
    var chord = new Array(8);
    for (var c = 0; c < 8; c++) {
        chord[c] = bass[c][3];
    }
    motifVar = motifVariator(motif, chord);
    highAcc = highAccompaniment(motif, chord);
    for (var r = 0; r < 1; r++) {
        var repTime = r * (rhythm(16,4) + dur(1));
        for (var i = 0; i < 640; i++) {

            player.queueWaveTable(audioContext, audioContext.destination, melInst[0], repTime + motifVar[i][0], motifVar[i][1]+12*motifVar[i][3]+musicKey, motifVar[i][2]);
        }

    }

    for (var i = 0; i < 320; i++)  {
        // console.log("bass[" + i + "][1] = " + bass[i][1]);
        player.queueWaveTable(audioContext, audioContext.destination, melInst[0], bass[i][0], bass[i][1]+12*3+musicKey, bass[i][2]);

    }
    for (var i = 0; i < 20; i++)  {
        // console.log("bass[" + i + "][1] = " + bass[i][1]);
        player.queueWaveTable(audioContext, audioContext.destination, higInst[0], highAcc[i][0], highAcc[i][1]+12*highAcc[i][3]+musicKey, highAcc[i][2], 0.5);
    }

    $( ".download-btn" ).show();

}


function stopAudio() {

    for (var i = 0; i < 1600; i++)  {
        player.envelopes[i].cancel();
    }

    return 0;
}

function motifGenerator(mood, layer, key, decVars, symVars) {

    var motif = new Array(24);

    //Temp
    if (mood <= 3) {
        mood = 5;
    }


    var symScore  = Math.floor( (symVars[0] + symVars[1] + symVars[2] + symVars[3])/4 );
    var vertScore = (symVars[0] + symVars[1])/2; //Choosing not to floor this one actually
    var horiScore = (symVars[2] + symVars[3])/2;

    console.log("ok its", symVars[0]);
    console.log("ok its", symVars[1]);
    console.log("ok its", symVars[2]);
    console.log("ok its", symVars[3]);


    // var pixInfo = [0, 1]; //(Red, Green, Blue, noPixels)

    for (var n = 0; n < 24; n++) {
        motif[n] = new Array(3);
        // for (var c = 0; c < 2; c++) {
        motif[n][0] = 0;//Beat
        motif[n][1] = 0;//Note
        motif[n][2] = 0;//Length
        // }
    }
    console.log("The mood is " + mood);

    if (mood > 3) {
        console.log("IM HERE!!!");

        // Start simple, always play root noot on beat 1 of bar 1
        var firstNote = 1;//decVars[0]
        motif[0][0] = rhythm(1, 1);
        motif[0][1] = heptScale(firstNote);
        motif[0][2] = dur(1);
        console.log("Note1 = ", chromScale(motif[0][1]) );
        firstNote = chromScale(motif[0][1]);

        // Second Not Branch anything goes
        var secondNote = decVars[1];
        motif[1][0] = rhythm(1, 2);
        motif[1][1] = heptScale(secondNote);
        motif[1][2] = dur(1);
        console.log("Note2 = ", chromScale(motif[1][1]) );
        secondNote = chromScale(motif[1][1]);

        // console.log("heptNote3 = ", chromScale(motif[1][1]) );

        // Third not branching anything goes again (unless dim 7th is chosen)
        var thirdNote = decVars[2];
        motif[2][0] = rhythm(1, 3);
        motif[2][2] = dur(1);
        if (secondNote == 7) {
             //Stick to major 7th to play safe
            if (thirdNote == 7) thirdNote = 7;
            else if (thirdNote >= 5) thirdNote = 5;
            else if (thirdNote < 5) thirdNote = 3;
        }
        else if (thirdNote == 7) {
            //If the 2nd note isnt a 3rd or 5th, change the 7th
            if ( !(secondNote == 3 || secondNote == 5) ){
                console.log("Changing 7th on 3rd note");
                thirdNote = Math.abs(thirdNote - secondNote);
                //If this is still somehow 7 just hit root again pls
                if (thirdNote == 7) thirdNote = 1;
            }
        }
        motif[2][1] = heptScale(thirdNote);
        console.log("Note3 = ", chromScale(motif[2][1]) );
        // console.log("heptNote3 = ", chromScale(motif[2][1]) );

        //Calculate actual outputted notes so far (in heptatonic scale)
        firstNote = chromScale(motif[0][1]);
        secondNote = chromScale(motif[1][1]);
        thirdNote = chromScale(motif[2][1]);

        // Fourth note must branch and consider previous Notes
        //Check for repeats
        if ( ( (firstNote == secondNote) || (firstNote == thirdNote) || (secondNote == thirdNote) ) && (symScore > 5) ) {
            //If symmetry score is high then repeat the non-repeated note to give symmetrical pattern
            console.log("There is repeat, with sym: ", symScore);
            if ( symScore > 7 ) {
                console.log("High Sym Score so straight repeat");
                if (firstNote == secondNote) {
                    // console.log("1 + 2 are the same");
                    motif[3][1] = heptScale(thirdNote);
                }
                else if (firstNote == thirdNote) {
                    // console.log("1 + 3 are the same");
                    motif[3][1] = heptScale(secondNote);
                }
                else {
                    // console.log("2 + 3 are the same");
                    motif[3][1] = heptScale(firstNote)
                }
            }
            //If symmetry score is medium choose to repeat an interval instead of a direct note
            else if (symScore > 5) {
                console.log("symScore of 6 or 7...");
                var tonalInterval;
                var oddNote;
                if (firstNote == secondNote) {
                    if (firstNote == thirdNote) {
                        console.log("SPecial CASE!");
                        oddNote = 0; //Special case with 3 repeated notes
                    }
                    oddNote = 3;
                    tonalInterval = Math.abs(thirdNote - firstNote) + 1;
                }
                else if (firstNote == thirdNote) {
                    oddNote = 2;
                    tonalInterval = Math.abs(secondNote - firstNote) + 1;
                }
                else {
                    oddNote = 1;
                    tonalInterval = Math.abs(firstNote - secondNote) + 1;
                }
                console.log("The tonal interval detected is " + tonalInterval);
                //Handing small intervals
                if (tonalInterval < 4) {
                    console.log("Tonal interval of 1, 2, or 3, so doubling the interval on top.");
                    console.log("odd note = " + oddNote);
                    if (oddNote == 1) {
                        if (firstNote < secondNote) {
                            motif[3][1] = heptScale(secondNote + tonalInterval-1);
                        }
                        else motif[3][1] = heptScale(firstNote + tonalInterval-1);
                    }
                    else if (oddNote == 2) {
                        if (secondNote < thirdNote) {
                            motif[3][1] = heptScale(thirdNote + tonalInterval-1);
                        }
                        else motif[3][1] = heptScale(secondNote + tonalInterval-1);
                    }
                    else if (oddNote == 3) {
                        if (thirdNote < firstNote) {
                            motif[3][1] = heptScale(firstNote + tonalInterval-1);
                        }
                        else motif[3][1] = heptScale(thirdNote + tonalInterval-1);
                    }
                    else if (oddNote == 0) {
                        motif[3][1] = firstNote; //Repeat the 4th like in sym > 7
                    }
                    else {
                        console.log("Error at note 4 in motifGenerator");
                    }
                }
                // Handling large intervals
                if (tonalInterval > 3) {

                    console.log("Tonal interval of " + tonalInterval + "so acting accordingly");
                    if (tonalInterval == 4) tonalInterval = 0;
                    if (tonalInterval == 5) tonalInterval = 3;
                    if (tonalInterval == 6) {
                        if (decVars[3] < 5) tonalInterval = -3;
                        if (decVars[3] >= 5) tonalInterval = -4;
                    }
                    if (tonalInterval == 7) {
                        if (decVars[3] < 5) tonalInterval = -2;
                        if (decVars[3] >= 5) tonalInterval = -4;
                    }

                    if (oddNote == 1) {
                        if (firstNote < secondNote) {
                            motif[3][1] = heptScale(secondNote - (tonalInterval-1) );
                        }
                        else motif[3][1] = heptScale(firstNote - (tonalInterval-1) );
                    }
                    else if (oddNote == 2) {
                        if (secondNote < thirdNote) {
                            motif[3][1] = heptScale(thirdNote - (tonalInterval-1) );
                        }
                        else motif[3][1] = heptScale(secondNote - (tonalInterval-1) );
                    }
                    else if (oddNote == 3) {
                        if (thirdNote < firstNote) {
                            motif[3][1] = heptScale(firstNote - (tonalInterval-1) );
                        }
                        else motif[3][1] = heptScale(thirdNote - (tonalInterval-1) );
                    }
                    else if (oddNote == 0) {
                        motif[3][1] = firstNote; //Repeat the 4th like in sym > 7
                    }
                    else {
                        console.log("Error at note 4 in motifGenerator");
                    }
                }

            }
        }
        //Else stick to pure decision for last time
        else {
            console.log("No repeats and/or low symmetry score")
            fourthNote = decVars[3];
            motif[3][1] = heptScale(fourthNote);
            fourthNote = chromScale(motif[3][1]);

            // console.log("Catch tonal discrencies tho");
            //Easy one for now avoid -dim 7..
            if (fourthNote == 7) {
                if ( !( secondNote == 3 || secondNote == 5 ) || !( thirdNote == 3 || thirdNote == 5 ) ) {
                    console.log("Changing 7th on 4rd note");
                    fourthNote = Math.abs(fourthNote - thirdNote);
                    //If this is still somehow 7 just hit root again pls
                    if (fourthNote == 7) thirdNote = 1;
                }
                motif[3][1] = heptScale(fourthNote);
            }
            else if (secondNote == 7 || thirdNote == 7) {
                console.log("REACHED!!!, ");
                if (decVars[3] < 3 ) {
                    fourthNote = 3;
                }
                else if (decVars[3] < 6) {
                    fourthNote = 5
                }
                else if (decVars[3] < 8) {
                    fourthNote = 7;
                }
                else {
                    fourthNote = 1
                }
                motif[3][1] = heptScale(fourthNote);
            }


        }
        motif[3][0] = rhythm(1, 4);
        motif[3][2] = dur(1);
        console.log("Note4 = ", chromScale(motif[3][1]) );

        //Reached first four core notes!
        //Now if there is image symmetry, we can repeat intervals, notes or general patterns for 5-8...

        //Detecting if notes have been previously repeated
        var repeatedNotes = new Array(8);
        for (var n = 0; n <= 7; n++){
            repeatedNotes[n] = 0;
        }

        firstNote = chromScale(motif[0][1]);
        secondNote = chromScale(motif[1][1]);
        thirdNote = chromScale(motif[2][1]);
        fourthNote = chromScale(motif[3][1]);
        var fifthNote;
        var sixthNote;
        var seventhNote;
        var eighthNote;

        repeatedNotes[chromScale(motif[0][1])] += 1;
        repeatedNotes[chromScale(motif[1][1])] += 1;
        repeatedNotes[chromScale(motif[2][1])] += 1;
        repeatedNotes[chromScale(motif[3][1])] += 1;
        var mostRepeats = 0;
        var indRepeats = 0;
        for (var n = 1; n <= 7; n++){
            if (repeatedNotes[n] > mostRepeats) {
                mostRepeats = repeatedNotes[n];
                indRepeats = n;
            }
        }
        console.log("MostRepeats = " + mostRepeats + ". indRepeats = " + indRepeats);

        var noMajor = 0;
        var noMinor = 0;
        var noDimin = 0;
        for (var n = 0; n < 4; n++) {
            if ( (chromScale(motif[n][1]) == 1) || ( (chromScale(motif[n][1]) == 4) || (chromScale(motif[n][1]) == 5) ) ) {
                noMajor += 1;
            }
            if ( (chromScale(motif[n][1]) == 2) || ( (chromScale(motif[n][1]) == 3) || (chromScale(motif[n][1]) == 6) ) ) {
                noMinor += 1;
            }
            if ( chromScale(motif[n][1]) == 7 ) {
                noDimin += 1;
            }
        }
        motif[4][0] = rhythm(2, 1);
        motif[4][2] = dur(1);

        motif[5][0] = rhythm(2, 2);
        motif[5][2] = dur(1);

        motif[6][0] = rhythm(2, 3);
        motif[6][2] = dur(1);

        motif[7][0] = rhythm(2, 4);
        motif[7][2] = dur(1);

        //Look at above average symScores
        if (symScore >= 6) {


            //If its very high then simply invert or straight repeat
            console.log("symScore = " + symScore);
            if (symScore >= 8) {

                if (horiScore >= vertScore) {

                    motif[4][1] = motif[0][1];
                    // console.log("Note5 = ", chromScale(motif[4][1]) );

                    motif[5][1] = motif[1][1];
                    // console.log("Note6 = ", chromScale(motif[5][1]) );

                    motif[6][1] = motif[2][1];
                    // console.log("Note7 = ", chromScale(motif[6][1]) );

                    motif[7][1] = motif[3][1];
                    // console.log("Note8 = ", chromScale(motif[7][1]) );

                }
                else {

                    motif[4][1] = motif[3][1];

                    motif[5][1] = motif[2][1];

                    motif[6][1] = motif[1][1];

                    motif[7][1] = motif[0][1];

                }

            }
            else if (symScore >= 6) {
                //See if there was a repeat in original 4.




                if (mostRepeats >= 2) {
                    //If the repeating notes is the root then we will bounce off it
                    // if (indRepeats == 1) {
                    var pivot1 = 0;
                    var pivot2 = 0;
                    var pivot1Loc = 0;
                    var pivot2Loc = 0;

                    //Repeat the root notes, and store the 'pivot' notes
                    for (var n = 0; n < 4; n++) {
                        if (chromScale(motif[n][1]) == indRepeats) {
                            motif[n+4][1] = heptScale(1);
                        }
                        else if (pivot1 == 0){
                            pivot1 = chromScale(motif[n][1]);
                            pivot1Loc = n;
                        }
                        else if (pivot2 == 0) {
                            pivot2 = chromScale(motif[n][1]);
                            pivot2Loc = n;
                        }

                    }


                    console.log("pivot 1 = " + pivot1 + ". Pivot 2 = " + pivot2);
                    if (noDimin == 0) {
                        var cadencePresent = 0;
                        if ( pivot1 == 5 || pivot1 == 4 ) {
                            cadencePresent += 1;
                        }
                        if ( pivot1 == 5 || pivot1 == 4 ) {
                            cadencePresent += 1;
                        }
                        console.log("Number of cadences in pivots = " + cadencePresent);
                        //Work out based on cadence
                        if (cadencePresent == 0) {
                            if (decVars[2] > 5){
                                motif[pivot2Loc+4][1] = heptScale(5);
                            }
                            else {
                                motif[pivot2Loc+4][1] = heptScale(4);
                            }
                            motif[pivot1Loc+4][1] = heptScale( harmonicTone(noMajor, noMinor, decVars[1]) );
                        }
                        else if (cadencePresent == 1) {
                            motif[pivot1Loc+4][1] = heptScale(pivot2);
                            motif[pivot2Loc+4][1] = heptScale(pivot1);
                        }
                        else if (cadencePresent == 2) {
                            motif[pivot1Loc+4][1] = heptScale(6);
                            motif[pivot2Loc+4][1] = heptScale(pivot2);

                        }
                    }
                    else {
                        var cadencePresent = 0;
                        if ( pivot1 == 5 || pivot1 == 4 ) {
                            cadencePresent += 1;
                        }
                        if ( pivot1 == 5 || pivot1 == 4 ) {
                            cadencePresent += 1;
                        }
                        console.log("Number of cadences in pivots = " + cadencePresent);
                        //Work out based on cadence
                        if (cadencePresent == 0) {
                            if (decVars[2] > 5){
                                motif[pivot2Loc+4][1] = heptScale(5);
                            }
                            else {
                                motif[pivot2Loc+4][1] = heptScale(4);
                            }
                            motif[pivot1Loc+4][1] = heptScale(3);
                        }
                        else if (cadencePresent == 1) {
                            motif[pivot1Loc+4][1] = heptScale(pivot2);
                            motif[pivot2Loc+4][1] = heptScale(pivot1);
                        }
                        else if (cadencePresent == 2) {
                            motif[pivot1Loc+4][1] = heptScale(7);
                            motif[pivot2Loc+4][1] = heptScale(pivot2);

                        }
                    }
                }
                //No repeats in first 4
                else {
                    //repeat position 1 -> 5
                    motif[4][1] = motif[0][1];

                    if (noDimin == 0) {
                        if (chromScale(motif[1][1]) != 6) {
                            motif[5][1] = heptScale(secondNote + 1);
                        }
                        else {
                            motif[5][1] = heptScale(secondNote - 1);
                        }
                        if (chromScale(motif[2][1]) != 6) {
                            motif[6][1] = heptScale(thirdNote + 1);
                        }
                        else {
                            motif[6][1] = heptScale(thirdNote - 1);
                        }
                        if (chromScale(motif[3][1]) != 6) {
                            motif[7][1] = heptScale(fourthNote + 1);
                        }
                        else {
                            motif[7][1] = heptScale(fourthNote - 1);
                        }

                    }
                    else {
                        if (chromScale(motif[1][1])%2 != 0) {
                            motif[5][1] = heptScale(secondNote + 2);
                        }
                        else {
                            motif[5][1] = heptScale(secondNote - 1);
                        }
                        if (chromScale(motif[2][1]) != 6) {
                            motif[6][1] = heptScale(thirdNote + 2);
                        }
                        else {
                            motif[6][1] = heptScale(thirdNote - 1);
                        }
                        if (chromScale(motif[3][1]) != 6) {
                            motif[7][1] = heptScale(fourthNote + 2);
                        }
                        else {
                            motif[7][1] = heptScale(fourthNote - 1);
                        }

                    }
                }

            }
        }
        else {

            if (noDimin == 0) {
                motif[4][1] = heptScale(harmonicTone(noMajor, noMinor, decVars[0]) );
                motif[5][1] = heptScale(harmonicTone(noMajor, noMinor, decVars[1]) );
                if (symScore >= 4 ) {
                    motif[6][1] = motif[2][1];
                }
                else {
                    motif[6][1] = heptScale(harmonicTone(noMajor, noMinor, decVars[2]) );
                }
                motif[7][1] = heptScale(harmonicTone(noMajor, noMinor, decVars[3]) );

            }
            else {
                motif[4][1] = heptScale( diminishedTone(decVars[0]) );
                motif[5][1] = heptScale( diminishedTone(decVars[1]) );
                motif[6][1] = heptScale( diminishedTone(decVars[2]) );
                motif[7][1] = heptScale( diminishedTone(decVars[3]) );
            }
        }


        // motif[3][0] = rhythm(1, 4);
        // motif[3][1] = heptScale(6);
        // motif[3][2] = dur(1);
        //
        // motif[4][0] = rhythm(2, 1);
        // motif[4][1] = heptScale(5);
        // motif[4][2] = dur(1);
        //
        // motif[5][0] = rhythm(2, 2);
        // motif[5][1] = heptScale(3);
        // motif[5][2] = dur(1);
        //
        // motif[6][0] = rhythm(2, 3);
        // motif[6][1] = heptScale(5);
        // motif[6][2] = dur(1);
        //
        // motif[7][0] = rhythm(2, 4);
        // motif[7][1] = heptScale(1);
        // motif[7][2] = dur(1);

        console.log("Note5 = ", chromScale(motif[4][1]) );
        console.log("Note6 = ", chromScale(motif[5][1]) );
        console.log("Note7 = ", chromScale(motif[6][1]) );
        console.log("Note8 = ", chromScale(motif[7][1]) );


        // ----------------------------- Rhythm ------------------------------

        if ( decVars[0] < 1 ) {

            console.log("Rhythm 0");

            motif[0][0] = rhythm(1,1);

            motif[1][0] = rhythm(1,1.5);

            motif[2][0] = rhythm(1,2);

            motif[3][0] = rhythm(1,3);

            motif[4][0] = rhythm(1,4.5);

            motif[5][0] = rhythm(2,1);

            motif[9][0] = rhythm(2,1.5);
            motif[9][1] = motif[5][1];
            motif[9][1] = dur(1/2);

            motif[6][0] = rhythm(2,2);

            motif[7][0] = rhythm(2,3);
        }
        else if ( decVars[0] < 2 ) {

            console.log("Rhythm 1");

            motif[0][0] = rhythm(1,1);

            motif[1][0] = rhythm(1,2);

            motif[2][0] = rhythm(1,3);

            motif[3][0] = rhythm(1,3.5);

            motif[4][0] = rhythm(2,1.5);

            motif[5][0] = rhythm(2,2);

            motif[6][0] = rhythm(2,3.5);

            motif[7][0] = rhythm(2,4);
        }
        else if ( decVars[0] < 3 ) {

            console.log("Rhythm 2");

            motif[0][0] = rhythm(1,1);
            motif[0][2] = dur(3);

            motif[1][0] = rhythm(1,3.5);
            motif[1][2] = dur(1/2);

            motif[2][0] = rhythm(1,4);
            motif[2][2] = dur(1/2);

            motif[3][0] = rhythm(1,4.5);
            motif[3][2] = dur(1/2);

            motif[4][0] = rhythm(2,1);
            motif[4][2] = dur(3);

            motif[5][0] = rhythm(2,3.5);
            motif[5][2] = dur(1/2);

            motif[6][0] = rhythm(2,4);
            motif[6][2] = dur(1/2);

            motif[7][0] = rhythm(2,4.5);
            motif[7][2] = dur(1/2);
        }
        else if ( decVars[0] < 4 ) {

            console.log("Rhythm 3");

            motif[0][0] = rhythm(1,1);

            motif[1][0] = rhythm(1,1.5);
            motif[1][2] = dur(1/2);

            motif[2][0] = rhythm(1,2.5);
            motif[2][2] = dur(1/2);

            motif[3][0] = rhythm(1,3.5);
            motif[3][2] = dur(1.5);

            motif[4][0] = rhythm(2,1);

            motif[5][0] = rhythm(2,1.5);
            motif[5][2] = dur(1/2);

            motif[6][0] = rhythm(2,2.5);
            motif[6][2] = dur(1/2);

            motif[7][0] = rhythm(2,3.5);
            motif[7][2] = dur(1.5);

            motif[8][0] = rhythm(1,2);
            motif[8][1] = motif[0][1];
            motif[8][2] = dur(1/2);

            motif[9][0] = rhythm(1,3);
            motif[9][1] = motif[0][1];
            motif[9][2] = dur(1/2);
            // motif[11][0] = rhythm(1,4)
            motif[10][0] = rhythm(2,2);
            motif[10][1] = motif[4][1];
            motif[10][2] = dur(1/2);

            motif[11][0] = rhythm(2,3);
            motif[11][1] = motif[4][1];
            motif[11][2] = dur(1/2);
        }
        else if ( decVars[0] < 5 ) {

            console.log("Rhythm 4");

            motif[0][0] = rhythm(1,1);

            motif[1][0] = rhythm(1,1.5);
            motif[1][2] = dur(1);

            motif[2][0] = rhythm(1,2.5);
            motif[2][2] = dur(1);

            motif[3][0] = rhythm(1,3.5);
            motif[3][2] = dur(1.5);

            motif[4][0] = rhythm(2,1);

            motif[5][0] = rhythm(2,1.5);
            motif[5][2] = dur(1);

            motif[6][0] = rhythm(2,2.5);
            motif[6][2] = dur(1);

            motif[7][0] = rhythm(2,3.5);
            motif[7][2] = dur(1.5);

        }
        else if ( decVars[0] < 6 ) {

            console.log("Rhythm 5");

            motif[0][0] = rhythm(1,1);

            motif[1][0] = rhythm(1,1.5);
            motif[1][2] = dur(1/2);

            motif[2][0] = rhythm(1,2);
            motif[2][2] = dur(1.5);

            motif[3][0] = rhythm(1,3.5);
            motif[3][2] = dur(1/2);

            motif[8][0] = rhythm(1,4);
            motif[8][1] = motif[3][1];
            motif[8][2] = dur(1);

            motif[4][0] = rhythm(2,1);

            motif[5][0] = rhythm(2,1.5);
            motif[5][2] = dur(1/2);

            motif[6][0] = rhythm(2,2);
            motif[6][2] = dur(1.5);

            motif[7][0] = rhythm(2,3.5);
            motif[7][2] = dur(1/2);

            motif[9][0] = rhythm(2,4);
            motif[9][1] = motif[7][1];
            motif[9][2] = dur(1);

        }
        else if ( decVars[0] < 7 ) {

            console.log("Rhythm 6");

            motif[0][0] = rhythm(1,1);

            motif[1][0] = rhythm(1,2);

            motif[2][0] = rhythm(1,3);
            motif[2][2] = dur(0.8);

            motif[3][0] = rhythm(1,3.8); //???
            motif[3][2] = dur(0.75);

            // resolve()
            motif[8][0] = rhythm(1,4.5);
            motif[8][1] = motif[3][1];
            motif[8][2] = dur(2);

            motif[4][0] = rhythm(2,3.5);
            motif[4][2] = dur(1,4);

            motif[5][0] = rhythm(2,3.75);
            motif[5][2] = dur(1/4);

            motif[6][0] = rhythm(2,4);
            motif[6][2] = dur(1/2);

            motif[7][0] = rhythm(2,4.5);
            motif[7][2] = dur(1/2);


        }
        else if ( decVars[0] < 8 ) {

            console.log("Rhythm 7");

            motif[0][0] = rhythm(1,1);

            motif[1][0] = rhythm(1,2);

            motif[2][0] = rhythm(1,3);

            motif[3][0] = rhythm(1,4.5); //???
            motif[3][2] = dur(0.5);


            motif[4][0] = rhythm(2,1);

            motif[5][0] = rhythm(2,2);

            motif[6][0] = rhythm(2,3);

            motif[7][0] = rhythm(2,4);

        }
        else if ( decVars[0] < 9 ) {

            console.log("Rhythm 8");

            motif[0][0] = rhythm(1,1);

            motif[1][0] = rhythm(1,2);

            motif[2][0] = rhythm(1,3);

            // motif[3][0] = rhythm(1,4.5); //???
            // motif[3][2] = dur(0.5);

            //
            // motif[4][0] = rhythm(2,1);
            //
            // motif[5][0] = rhythm(2,2);

            motif[6][0] = rhythm(2,3);

            motif[7][0] = rhythm(2,4);

        }
        else if ( decVars[0] <= 10 ) {
            //Change
            console.log("Rhythm 9");

            motif[0][0] = rhythm(1,1);

            motif[1][0] = rhythm(1,2);

            motif[2][0] = rhythm(1,3);

            // motif[3][0] = rhythm(1,4.5); //???
            // motif[3][2] = dur(0.5);

            //
            // motif[4][0] = rhythm(2,1);
            //
            // motif[5][0] = rhythm(2,2);

            motif[6][0] = rhythm(2,3);

            motif[7][0] = rhythm(2,4);

        }
    }
    else {
        window.alert("BAD MOOD WIP");
    }


    return motif;

}

function motifVariator(motif, chord) {

    motifVar = new Array(640);
    for (var n = 0; n < 640; n++) {
        motifVar[n] = new Array(3);

        motifVar[n][0] = 0;
        motifVar[n][1] = 0;
        motifVar[n][2] = 0;
        motifVar[n][3] = 4;
    }

    //Initial run
    for (var n = 0; n < 24; n++) {
        motifVar[n][0] = motif[n][0];
        motifVar[n][1] = motif[n][1];
        motifVar[n][2] = motif[n][2];
    }

    var motifPointer = 24;
    var rhythmPointer = 3;


    //Choose variation on note
    for (var c = 1; c < 16; c++) {

        var original = chromScale(motif[0][1]);
        var curDiff = 0;
        var minDiff = 10;
        var chordCompare = new Array(3);
        var noteChosen = 0;

        chordCompare[0] = chord[mod(c,8)];
        chordCompare[1] = mod(chord[mod(c,8)]+2, 7);
        chordCompare[2] = mod(chord[mod(c,8)]+4, 7);

        for (var i = 0; i < 3; i++) {
            curDiff = Math.abs(chordCompare[i] - original);
            if (curDiff < minDiff) {
                minDiff = curDiff;
                noteChosen = chordCompare[i];
            }
        }
        //heptScale(5)

        motifVar[motifPointer + 0][0] = rhythm(rhythmPointer,1) + motif[0][0];
        motifVar[motifPointer + 0][1] = heptScale(noteChosen);
        motifVar[motifPointer + 0][2] = motif[0][2];
        for (var n = 1; n < 24; n++) {
            motifVar[motifPointer + n][0] = rhythm(rhythmPointer,1) +  motif[n][0];
            motifVar[motifPointer + n][1] = motif[n][1];
            motifVar[motifPointer + n][2] = motif[n][2];
        }

        if (c > 8) {
            var original = chromScale(motif[2][1]);
            var curDiff = 0;
            var minDiff = 10;
            var chordCompare = new Array(3);
            var noteChosen = 0;

            chordCompare[0] = chord[mod(c,8)];
            chordCompare[1] = mod(chord[mod(c,8)]+2, 7);
            chordCompare[2] = mod(chord[mod(c,8)]+4, 7);

            for (var i = 0; i < 3; i++) {
                curDiff = Math.abs(chordCompare[i] - original);
                if (curDiff < minDiff) {
                    minDiff = curDiff;
                    noteChosen = chordCompare[i];
                }
            }
            //heptScale(5)

            motifVar[motifPointer + 2][0] = rhythm(rhythmPointer,1) + motif[2][0];
            motifVar[motifPointer + 2][1] = heptScale(noteChosen);
            motifVar[motifPointer + 2][2] = motif[2][2];
            // motifVar[motifPointer + 2][3] = 5;

        }
        if (c > 12) {
            var original = chromScale(motif[3][1]);
            var curDiff = 0;
            var minDiff = 10;
            var chordCompare = new Array(3);
            var noteChosen = 0;

            chordCompare[0] = chord[mod(c,8)];
            chordCompare[1] = mod(chord[mod(c,8)]+2, 7);
            chordCompare[2] = mod(chord[mod(c,8)]+4, 7);

            for (var i = 0; i < 3; i++) {
                curDiff = Math.abs(chordCompare[i] - original);
                if (curDiff < minDiff) {
                    minDiff = curDiff;
                    noteChosen = chordCompare[i];
                }
            }

            motifVar[motifPointer + 3][0] = rhythm(rhythmPointer,1) + motif[3][0];
            motifVar[motifPointer + 3][1] = heptScale(noteChosen);
            motifVar[motifPointer + 3][2] = motif[3][2];
            // motifVar[motifPointer + 3][3] = 5;

        }

        motifPointer += 24;
        rhythmPointer += 2;
    }

    return motifVar;

}

function bassGenerator( mood, layer, key, decVars, symVars, motif ) {
    //For now we just generate backing chords and repeat motif over, unchanged

    var bass = new Array(320);

    for (var n = 0; n < 320; n++) {
        bass[n] = new Array(4);
        // for (var c = 0; c < 2; c++) {
        bass[n][0] = 0;//Beat
        bass[n][1] = 0;//Note
        bass[n][2] = 0;//Length
        bass[n][3] = 0;//Chord for motifVariator
        // }
    }
    //
    // var chord = new Array(8);
    //
    // for (var n = 0; n < 24; n++) {
    //     chord[n] = new Array(2);
    //     // for (var c = 0; c < 2; c++) {
    //     bass[n][0] = 0;//Octave
    //     bass[n][1] = 0;//Note
    //     // }
    // }

    //Just make decision for now....
    if (decVars[1] < 1) {

        console.log("Bass 0");
        //The absolute classic
        bass[0][0] = rhythm(1, 1);
        bass[0][1] = heptScale(1);
        bass[0][2] = dur(8);

        bass[1][0] = rhythm(3, 1);
        bass[1][1] = heptScale(6)-12;
        bass[1][2] = dur(8);

        bass[2][0] = rhythm(5, 1);
        bass[2][1] = heptScale(4)-12;
        bass[2][2] = dur(8);

        bass[3][0] = rhythm(7, 1);
        bass[3][1] = heptScale(5)-12;
        bass[3][2] = dur(8);

        bass[4][0] = rhythm(9, 1);
        bass[4][1] = heptScale(1);
        bass[4][2] = dur(8);

        bass[5][0] = rhythm(10, 1);
        bass[5][1] = heptScale(6)-12;
        bass[5][2] = dur(8);

        bass[6][0] = rhythm(11, 1);
        bass[6][1] = heptScale(4)-12;
        bass[6][2] = dur(8);

        bass[7][0] = rhythm(13, 1);
        bass[7][1] = heptScale(5)-12;
        bass[7][2] = dur(8);
    }
    else if (decVars[1] < 2) {
        console.log("Bass 1");
        //Put it in A minor?
        bass[0][0] = rhythm(1, 1);
        bass[0][1] = heptScale(6)-12;
        bass[0][2] = dur(8);

        bass[1][0] = rhythm(3, 1);
        bass[1][1] = heptScale(4)-12;
        bass[1][2] = dur(8);

        bass[2][0] = rhythm(5, 1);
        bass[2][1] = heptScale(1);
        bass[2][2] = dur(8);

        bass[3][0] = rhythm(7, 1);
        bass[3][1] = heptScale(5)-12;
        bass[3][2] = dur(8);

        bass[4][0] = rhythm(9, 1);
        bass[4][1] = heptScale(6)-12;
        bass[4][2] = dur(8);

        bass[5][0] = rhythm(11, 1);
        bass[5][1] = heptScale(4)-12;
        bass[5][2] = dur(8);

        bass[6][0] = rhythm(13, 1);
        bass[6][1] = heptScale(1);
        bass[6][2] = dur(8);

        bass[7][0] = rhythm(15, 1);
        bass[7][1] = heptScale(5)-12;
        bass[7][2] = dur(8);

    }
    else if (decVars[1] <= 10) {
        console.log("Custom chord progression chosen");
        chord = chordPath(decVars); //Gets the 8 chord path
        for (var c = 0; c < 8; c++) {
            bass[c][3] = chord[c][1];
        }


        chordProg = chordProgression(decVars, chord);
        //
        // for (var n = 0; n < 8; n++) {
        //     bass[n][0] = rhythm((n*2)+1,1);
        //     bass[n][1] = heptScale(chord[n][1]) - (chord[n][0]*12);
        //     bass[n][2] = dur(8);
        // }

        for (var n = 0; n < 320; n++) {
            bass[n][0] = chordProg[n][0];
            bass[n][1] = chordProg[n][1];
            bass[n][2] = chordProg[n][2];
        }

        // for (var n = 0; n < 8; n++) {
        //     for (var m = 0; m < 4; m++) {
        //         bass[n*4 + m][0] = rhythm((n*2)+1,1);
        //         bass[n*4 + m][1] = chordProg[n*4 + m][1];// - (chord[n*4 + m][0]*12);
        //         bass[n*4 + m][2] = dur(8);
        //     }
        // }

    }

    return bass;
}

function chordPath(decVars) {

    var chordDecision = new Array(6);

    for (var n = 0; n < 6; n++) {
        chordDecision[n] = decVars[n];
    }

    chordDecision[4] = Math.abs(chordDecision[0]-chordDecision[1]);
    chordDecision[5] = Math.abs(chordDecision[2]-chordDecision[3]);

    var chordDecided = new Array(6);
    for (var n = 0; n < 6; n++) {
        if (chordDecision[n] < 4) {
            chordDecided[n] = 0;
        }
        else if (chordDecision[n] < 5 ) {
            chordDecided[n] = 1;
        }
        else if (chordDecision[n] < 7 ) {
            chordDecided[n] = 2;
        }
        else if (chordDecision[n] < 9) {
            chordDecided[n] = 3;
        }
        else {
            chordDecided[n] = 4;
        }
    }

    var problematic = new Array(8);
    for (var n = 0; n < 8; n++) {
        problematic[n] = 0;
    }


    // console.log("chordDecided[0] = " + chordDecided[0]);
    // console.log("chordDecided[1] = " + chordDecided[1]);
    // console.log("chordDecided[2] = " + chordDecided[2]);
    // console.log("chordDecided[3] = " + chordDecided[3]);
    // console.log("chordDecided[4] = " + chordDecided[4]);
    //
    // console.log("chordDecision[0] = " + chordDecision[0]);
    // console.log("chordDecision[1] = " + chordDecision[1]);
    // console.log("chordDecision[2] = " + chordDecision[2]);
    // console.log("chordDecision[3] = " + chordDecision[3]);
    // console.log("chordDecision[4] = " + chordDecision[4]);


    var intervalNum = new Array(6);

    for (var n = 0; n < 6; n++) {
        intervalNum[n] = 0;
    }

    var nextChord;
    var endTonic = false;
    var harmonyOK = false;
    var noInterations = 0;
    // var chordDecision1 = decVars[0];
    // var chordDecision2 = decVars[1];
    // var chordDecision3 = decVars[2];
    // var chordDecision4 = decVars[3];
    // var interval1 = 0;
    // var interval2 = 0;
    // var interval3 = 0;
    // var interval4 = 0;
    // var interval5 = 0;
    // var interval6 = 0;

    var chord = new Array(8);
    for (var n = 0; n < 8; n++) {
        chord[n] = new Array(2);
        // for (var c = 0; c < 2; c++) {
        chord[n][0] = 0;//Octave
        chord[n][1] = 0;//Note
        // }
    }

    //Get the first chord and the last chord.
    chord[0][1] = 1;

    if (decVars[0] < 4 ){
        chord[7][1] = 5;
    }
    else {
        chord[7][1] = 1;
        chord[6][1] = 5;
        endTonic = true;
    }

    //Work Backwards
    for (var tries = 0; tries < 20; tries++) {

        //Deciding
        for (var d = 0; d < 6; d++) {
            if (chordDecided[d] == 0) {
                intervalNum[d] = - 4; //Down a fifth
            }
            else if (chordDecided[d] == 1 ) {
                intervalNum[d] = - 1; //Down a tone
            }
            else if (chordDecided[d] == 2  ) {
                intervalNum[d] = + 2; //Up 2 tones
            }
            else if (chordDecided[d] == 3 ) {
                intervalNum[d] = + 1; //Up a tone
            }
            else {
                intervalNum[d] = - 2; //Down 2 tones
            }
        }

        //Creating
        for (var c = 1; c < 7; c++) {
            if (tries == 0) {//Initial run
                newChord = ( mod((chord[c-1][1] + intervalNum[c-1]), 7));
                if (endTonic == true && c == 6) {
                    //all is well
                }
                else {
                    if ( newChord == 0) newChord = 7;
                    console.log()
                    chord[c][1] = newChord;
                }
            }
            else { //Subsequent run
                if (endTonic == true && c == 6) {
                    //all is well
                }
                else if (chord[c][1] == 0) {
                    newChord = ( mod((chord[c-1][1] + intervalNum[c-1]), 7));
                    console.log("C = " + c + ". newChord = " + newChord);
                    console.log("IntervalNum[c-1] = " + intervalNum[c-1] + ", chordDecided[c-1] = " + chordDecided[c-1]);
                    if (newChord == 0) newChord = 7;
                    console.log("C = " + c + ". newChord = " + newChord);
                    chord[c][1] = newChord;
                }
            }
        }

        console.log("\nPrior to checking= " + noInterations);
        console.log("Chord 1 = "+ chord[0][1]);
        console.log("Chord 2 = "+ chord[1][1]);
        console.log("Chord 3 = "+ chord[2][1]);
        console.log("Chord 4 = "+ chord[3][1]);
        console.log("Chord 5 = "+ chord[4][1]);
        console.log("Chord 6 = "+ chord[5][1]);
        console.log("Chord 7 = "+ chord[6][1]);
        console.log("Chord 8 = "+ chord[7][1]);

        //Checking
        var problemFound = false;
        for (var c = 1; c < 8; c++) {
            harmonyOK = false;
            // console.log("c is " + c + "chord is " + chord[c][1]);
            if (chord[c][1]==0) {
                problemFound = true; //Bad note
                problematic[c] += 1;
            }
            else if (chord[c][1]==7) {
                problemFound = true;
                problematic[c] += 1;
                chord[c][1] = 0; //Bad note
            }
            else {

                newChord = ( mod( (chord[c-1][1] + 1), 7));
                if (newChord == 0) newChord = 7;
                // console.log("Does " + chord[c][1] + " == " + newChord + "?");
                if (chord[c][1] == newChord) harmonyOK = true;

                newChord = ( mod( (chord[c-1][1] - 1), 7));
                if (newChord == 0) newChord = 7;
                // console.log("Does " + chord[c][1] + " == " + newChord + "?");
                if (chord[c][1] == newChord) harmonyOK = true;

                newChord = ( mod( (chord[c-1][1] + 2), 7));
                if (newChord == 0) newChord = 7;
                // console.log("Does " + chord[c][1] + " == " + newChord + "?");
                if (chord[c][1] == newChord) harmonyOK = true;

                newChord = ( mod( (chord[c-1][1] - 2), 7));
                if (newChord == 0) newChord = 7;
                // console.log("Does " + chord[c][1] + " == " + newChord + "?");
                if (chord[c][1] == newChord) harmonyOK = true;

                newChord = ( mod( (chord[c-1][1] - 4), 7));
                if (newChord == 0) newChord = 7;
                // console.log("Does " + chord[c][1] + " == " + newChord + "?");
                if (chord[c][1] == newChord) harmonyOK = true;

                if (!harmonyOK) {
                    // console.log("There was a problem soz");
                    problemFound = true;
                    problematic[c] += 1;
                    chord[c-1][1] = 0; //Bad note
                }
                else {
                    problematic[c] = 0;
                }
            }
        }

        //Breaking or updating decisions
        if (problemFound) {
            //Change the chordDecisions that lead to the error
            for (var p = 0; p < 8; p++) {
                if (chord[p][1] == 0) {
                    console.log("problematic[" + p + "] = " + problematic[p]);
                    if (problematic[p] > 5) {
                        console.log("problem aint changin");
                        if (p > 1) {
                            chordDecided[p-2] = mod((chordDecided[p-1] + 1 ), 5);
                        }
                        else if (p < 7) {
                            chordDecided[p] = mod((chordDecided[p-1] + 1 ), 5);
                        }
                        else {
                            window.alert("Error at ChordPath iterations");
                        }

                    }
                    else {
                        chordDecided[p-1] = mod((chordDecided[p-1] + 1 ), 5);

                    }
                }
            }
        }
        else {

            break;
        }

        console.log("chordDecided[0] = " + chordDecided[0]);
        console.log("chordDecided[1] = " + chordDecided[1]);
        console.log("chordDecided[2] = " + chordDecided[2]);
        console.log("chordDecided[3] = " + chordDecided[3]);
        console.log("chordDecided[4] = " + chordDecided[4]);
        console.log("chordDecided[5] = " + chordDecided[5]);

        noInterations += 1;
        console.log("\nNumber of Iterations = " + noInterations);
        console.log("Chord 1 = "+ chord[0][1]);
        console.log("Chord 2 = "+ chord[1][1]);
        console.log("Chord 3 = "+ chord[2][1]);
        console.log("Chord 4 = "+ chord[3][1]);
        console.log("Chord 5 = "+ chord[4][1]);
        console.log("Chord 6 = "+ chord[5][1]);
        console.log("Chord 7 = "+ chord[6][1]);
        console.log("Chord 8 = "+ chord[7][1]);

    }
    console.log("Number of Iterations = " + noInterations);
    console.log("Chord 1 = "+ chord[0][1]);
    console.log("Chord 2 = "+ chord[1][1]);
    console.log("Chord 3 = "+ chord[2][1]);
    console.log("Chord 4 = "+ chord[3][1]);
    console.log("Chord 5 = "+ chord[4][1]);
    console.log("Chord 6 = "+ chord[5][1]);
    console.log("Chord 7 = "+ chord[6][1]);
    console.log("Chord 8 = "+ chord[7][1]);




    return chord;
}

function chordProgression(decVars, chord) {

    var startTime = 0;
    var bassPointer = 0;

    var baseChoser = new Array(8);
    for (var n = 0; n < 8; n++) {
        baseChoser[0] = 0;
    }

    if (decVars[2] > 5) {
        baseChoser[0] = 1;
        baseChoser[1] = 1;
        baseChoser[3] = 1;
        baseChoser[5] = 1;
    }
    else {
        baseChoser[0] = 1;
        baseChoser[1] = 1;
        baseChoser[2] = 1;
        baseChoser[4] = 1;
    }


    var chordProg = new Array(320);
    for (var n = 0; n < 320; n++) {
        chordProg[n] = new Array(3);

        chordProg[n][0] = 0; //Rhythm
        chordProg[n][1] = 0; //Note
        chordProg[n][2] = 0; //Duration
    }

    var majMinDim = 0; //1 = major, 2 = minor, 3 = diminished

    //Choice 0
    if (baseChoser[0] == 1) {
        for (var n = 0; n < 4; n++) {
            chordProg[bassPointer+n][0] = rhythm(( (startTime+n)*2 )+1,1);
            chordProg[bassPointer+n][1] = heptScale(chord[n][1]) - (chord[n][0]*12);
            chordProg[bassPointer+n][2] = dur(8);
        }
        bassPointer += 4;
        startTime += 4;
    }

    //Choice 1
    if (baseChoser[1] == 1) {
        for (var n = 0; n < 4; n++) {
            for (var m = 0; m < 3; m++) {
                if (m == 0) {
                    chordProg[bassPointer+n][0] = rhythm(( (startTime+n)*2 )+1,1);
                    chordProg[bassPointer+n][1] = heptScale(chord[n][1]) - (chord[n][0]*12);
                    chordProg[bassPointer+n][2] = dur(6);
                }
                else if (m == 1) {
                    chordProg[bassPointer+n+4][0] = rhythm(( (startTime+n)*2 )+2,1);
                    chordProg[bassPointer+n+4][1] = heptScale(chord[n][1]+2) - ((chord[n][0]-1)*12);
                    chordProg[bassPointer+n+4][2] = dur(2);
                }
                else {
                    chordProg[bassPointer+n+8][0] = rhythm(( (startTime+n)*2 )+2.5,1);
                    chordProg[bassPointer+n+8][1] = heptScale(chord[n][1]) - ((chord[n][0]-1)*12);
                    chordProg[bassPointer+n+8][2] = dur(2);
                }
            }
        }
        bassPointer += 12;
        startTime += 4;
    }

    //Choice 2
    if (baseChoser[2] == 1) {
        for (var n = 0; n < 4; n++) {
            for (var m = 0; m < 3; m++) {
                if (m == 0) {
                    chordProg[bassPointer+n][0] = rhythm(( (startTime+n)*2 )+1,1);
                    chordProg[bassPointer+n][1] = heptScale(chord[n][1]) - (chord[n][0]*12);
                    chordProg[bassPointer+n][2] = dur(6);
                }
                else if (m == 1) {
                    chordProg[bassPointer+n+4][0] = rhythm(( (startTime+n)*2 )+2,1);
                    chordProg[bassPointer+n+4][1] = heptScale(chord[n][1]+4) - (chord[n][0]*12);
                    chordProg[bassPointer+n+4][2] = dur(2);
                }
                else {
                    chordProg[bassPointer+n+8][0] = rhythm(( (startTime+n)*2 )+2,1);
                    chordProg[bassPointer+n+8][1] = heptScale(chord[n][1]) - ((chord[n][0]-1)*12);
                    chordProg[bassPointer+n+8][2] = dur(2);
                }
            }
        }
        bassPointer += 12;
        startTime += 4;
    }

    //Choice 3
    if (baseChoser[3] == 1) {
        for (var n = 0; n < 4; n++) {
            for (var m = 0; m < 4; m++) {
                if (m == 0) {
                    chordProg[bassPointer+n][0] = rhythm(( (startTime+n)*2 )+1,1);
                    chordProg[bassPointer+n][1] = heptScale(chord[n][1]) - (chord[n][0]*12);
                    chordProg[bassPointer+n][2] = dur(6);
                }
                else if (m == 1) {
                    chordProg[bassPointer+n+4][0] = rhythm(( (startTime+n)*2 )+1.25,1);
                    chordProg[bassPointer+n+4][1] = heptScale(chord[n][1]+4) - (chord[n][0]*12);
                    chordProg[bassPointer+n+4][2] = dur(2);
                }
                else if (m == 2) {
                    chordProg[bassPointer+n+8][0] = rhythm(( (startTime+n)*2 )+1.5,1);
                    chordProg[bassPointer+n+8][1] = heptScale(chord[n][1]) - ((chord[n][0]-1)*12);
                    chordProg[bassPointer+n+8][2] = dur(2);
                }
                else {
                    chordProg[bassPointer+n+12][0] = rhythm(( (startTime+n)*2 )+1.75,1);
                    chordProg[bassPointer+n+12][1] = heptScale(chord[n][1]+4) - (chord[n][0]*12);
                    chordProg[bassPointer+n+12][2] = dur(6);
                }
            }
        }
        bassPointer += 16;
        startTime += 4;
    }

    //Choice 4
    if (baseChoser[4] == 1) {
        for (var n = 0; n < 4; n++) {
            for (var m = 0; m < 4; m++) {
                if (m == 0) {
                    chordProg[bassPointer+n][0] = rhythm(( (startTime+n)*2 )+1,1);
                    chordProg[bassPointer+n][1] = heptScale(chord[n][1]) - (chord[n][0]*12);
                    chordProg[bassPointer+n][2] = dur(6);
                }
                else if (m == 1) {
                    chordProg[bassPointer+n+4][0] = rhythm(( (startTime+n)*2 )+2,1);
                    chordProg[bassPointer+n+4][1] = heptScale(chord[n][1]) - ((chord[n][0]-1)*12);
                    chordProg[bassPointer+n+4][2] = dur(2);
                }
                else if (m == 2) {
                    chordProg[bassPointer+n+8][0] = rhythm(( (startTime+n)*2 )+2,1);
                    chordProg[bassPointer+n+8][1] = heptScale(chord[n][1]+2) - ((chord[n][0]-1)*12);
                    chordProg[bassPointer+n+8][2] = dur(2);
                }
                else {
                    chordProg[bassPointer+n+12][0] = rhythm(( (startTime+n)*2 )+2,1);
                    chordProg[bassPointer+n+12][1] = heptScale(chord[n][1]+4) - ((chord[n][0]-1)*12);
                    chordProg[bassPointer+n+12][2] = dur(2);
                }
            }
        }
        bassPointer += 16;
        startTime += 4;
    }

    //Choice 5
    if (baseChoser[5] == 1) {
        for (var n = 0; n < 4; n++) {
            for (var m = 0; m < 8; m++) {
                if (m == 0) {
                    chordProg[bassPointer+n][0] = rhythm(( (startTime+n)*2 )+1,1);
                    chordProg[bassPointer+n][1] = heptScale(chord[n][1]) - (chord[n][0]*12);
                    chordProg[bassPointer+n][2] = dur(6);
                }
                else if (m == 1) {
                    chordProg[bassPointer+n+4][0] = rhythm(( (startTime+n)*2 )+1.25,1);
                    chordProg[bassPointer+n+4][1] = heptScale(chord[n][1]+2) - (chord[n][0]*12);
                    chordProg[bassPointer+n+4][2] = dur(2);
                }
                else if (m == 2) {
                    chordProg[bassPointer+n+8][0] = rhythm(( (startTime+n)*2 )+1.5,1);
                    chordProg[bassPointer+n+8][1] = heptScale(chord[n][1]+4) - (chord[n][0]*12);
                    chordProg[bassPointer+n+8][2] = dur(2);
                }
                else if (m == 3) {
                    chordProg[bassPointer+n+12][0] = rhythm(( (startTime+n)*2 )+1.75,1);
                    chordProg[bassPointer+n+12][1] = heptScale(chord[n][1]) - ((chord[n][0]-1)*12);
                    chordProg[bassPointer+n+12][2] = dur(2);
                }
                else if (m == 4) {
                    chordProg[bassPointer+n+16][0] = rhythm(( (startTime+n)*2 )+2,1);
                    chordProg[bassPointer+n+16][1] = heptScale(chord[n][1]+2) - ((chord[n][0]-1)*12);
                    chordProg[bassPointer+n+16][2] = dur(2);
                }
                else if (m == 5) {
                    chordProg[bassPointer+n+20][0] = rhythm(( (startTime+n)*2 )+2.25,1);
                    chordProg[bassPointer+n+20][1] = heptScale(chord[n][1]) - ((chord[n][0]-1)*12);
                    chordProg[bassPointer+n+20][2] = dur(2);
                }
                else if (m == 6) {
                    chordProg[bassPointer+n+24][0] = rhythm(( (startTime+n)*2 )+2.5,1);
                    chordProg[bassPointer+n+24][1] = heptScale(chord[n][1]+4) - (chord[n][0]*12);
                    chordProg[bassPointer+n+24][2] = dur(2);
                }
                else {
                    chordProg[bassPointer+n+28][0] = rhythm(( (startTime+n)*2 )+2.75,1);
                    chordProg[bassPointer+n+28][1] = heptScale(chord[n][1]+2) - (chord[n][0]*12);
                    chordProg[bassPointer+n+28][2] = dur(2);
                }
            }
        }
        bassPointer += 32;
        startTime += 4;
    }

    return chordProg;
}
//
function highAccompaniment(motif, chord) {

    highAcc = new Array(640);
    for (var n = 0; n < 640; n++) {
        highAcc[n] = new Array(3);

        highAcc[n][0] = 0;
        highAcc[n][1] = 0;
        highAcc[n][2] = 0;
        highAcc[n][3] = 5;
    }

    var chordCounter = new Array(8);
    for (var n = 0; n < 8; n++) {
        chordCounter[n] = 0;
    }


    var startTime = 8;
    var bassPointer = 8;

    for (var n = 0; n < 8; n++) {
        highAcc[n][0] = rhythm(( (startTime+n)*2 )+1,1);

        highAcc[bassPointer+n][0] = rhythm(( (startTime+n)*2 )+1,1);
        highAcc[bassPointer+n][1] = heptScale(chord[n]);
        highAcc[bassPointer+n][2] = dur(8);
        if (chordCounter[chord[n]] > 1) {
            highAcc[bassPointer+n][3] = 6;
        }

        chordCounter[chord[n]] += 1;
    }

    return highAcc;

}

function heptScale(heptNote) {
    //Major Heptatonic to Chromatic scale
    var chromNote = 1;
    // console.log("heptNote =", heptNote);
    if (heptNote < 1 || heptNote > 7) {
        heptNote = (heptNote%8) + 1;
    }
    // console.log("heptNote2 =", heptNote);

    //Triple === didn't work here...
    if (heptNote == 1) chromNote = 0;
    if (heptNote == 2) chromNote = 2;
    if (heptNote == 3) chromNote = 4;
    if (heptNote == 4) chromNote = 5;
    if (heptNote == 5) chromNote = 7;
    if (heptNote == 6) chromNote = 9;
    if (heptNote == 7) chromNote = 11;

    return chromNote;
}

function chromScale(chromNote) {
    var heptNote = 0;

    if (chromNote == 0)  heptNote = 1;
    if (chromNote == 2)  heptNote = 2;
    if (chromNote == 4)  heptNote = 3;
    if (chromNote == 5)  heptNote = 4;
    if (chromNote == 7)  heptNote = 5;
    if (chromNote == 9)  heptNote = 6;
    if (chromNote == 11) heptNote = 7;

    return heptNote;
}

function harmonicTone(noMajor, noMinor, decision) {
    var heptTone;
    if (decision <= 3) {
        if (noMinor > noMajor) {
            heptTone = 2;
        }
        else {
            heptTone = 1;
        }
    }
    else if ( decision <= 7) {
        if (noMinor > noMajor) {
            heptTone = 3;
        }
        else {
            heptTone = 4;
        }
    }
    else if ( decision <= 10) {
        if (noMinor > noMajor) {
            heptTone = 6;
        }
        else {
            heptTone = 5;
        }
    }
    return heptTone;
}

function diminishedTone(decision) {
    var dimTone;
    if (decision <= 2){
        dimTone = 1;
    }
    else if (decision <= 5){
        dimTone = 3;
    }
    else if (decision <= 8){
        dimTone = 5;
    }
    else {
        dimTone = 7;
    }
    return dimTone;
}

function rhythm(bar, beats) {

    // var bpm = 80;
    var timeSig = 4;

    var noBeats = ((bar-1)*timeSig + (beats-1));
    return ( noBeats*(60/bpm) );
}

function dur(noteLength) {
    // var bpm = 80;
    //4 = semibreve
    //2 = minum
    //1 = crotchet
    //1/2 = quaver
    //1/4 = semiquaver

    return ( noteLength*(60/bpm) ) ;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

// function textPlayer(motif) {
//
// }
//
// function resolve(one, two, three) {
//
// }




// Script for Testing by admin
// var slider1 = document.getElementById("slider1");
// var output1 = document.getElementById("range1");
// output1.innerHTML = slider1.value;
// slider1.oninput = function() {
//     output1.innerHTML = this.value;
// }
//
// var slider2 = document.getElementById("slider2");
// var output2 = document.getElementById("range2");
// output2.innerHTML = slider2.value;
// slider2.oninput = function() {
//     output2.innerHTML = this.value;
// }
//
// var slider3 = document.getElementById("slider3");
// var output3 = document.getElementById("range3");
// output3.innerHTML = slider3.value;
// slider3.oninput = function() {
//     output3.innerHTML = this.value;
// }
//
// var slider4 = document.getElementById("slider4");
// var output4 = document.getElementById("range4");
// output4.innerHTML = slider4.value;
// slider4.oninput = function() {
//     output4.innerHTML = this.value;
// }
//
// var slider5 = document.getElementById("slider5");
// var output5 = document.getElementById("range5");
// output5.innerHTML = slider5.value;
// slider5.oninput = function() {
//     output5.innerHTML = this.value;
// }
//
// var slider6 = document.getElementById("slider6");
// var output6 = document.getElementById("range6");
// output6.innerHTML = slider6.value;
// slider6.oninput = function() {
//     output6.innerHTML = this.value;
// }
//
// var slider7 = document.getElementById("slider7");
// var output7 = document.getElementById("range7");
// output7.innerHTML = slider7.value;
// slider7.oninput = function() {
//     output7.innerHTML = this.value;
// }
//
// var slider8 = document.getElementById("slider8");
// var output8 = document.getElementById("range8");
// output8.innerHTML = slider8.value;
// slider8.oninput = function() {
//     output8.innerHTML = this.value;
// }
//
// function adminTestButton(){
//     audioTester(1,4,slider1.value,slider2.value,slider3.value,slider4.value,slider5.value,slider6.value,slider7.value,slider8.value);
// }
