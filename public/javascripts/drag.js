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
              document.getElementById("button-left").style.opacity = "0.0";
              document.getElementsByClassName("container2")[0].style.opacity = "1.0";
              document.getElementById("p1").style.textAlign = "center";
              document.getElementById("p1").style.top = "10.5%";
              document.getElementById("p1").innerHTML = "image is <br> ready!";
              showConvert();
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});


function showConvert(){
    $("#p3").fadeIn();
    document.getElementById("p3").style.opacity = 1.0;
    $(".container3").fadeIn();
    document.getElementsByClassName("container3")[0].style.opacity = 1.0;
}
function convert(){
    // document.getElementsByClassName("convert-btn")[0].innerHTML = "Converting";
    for (i = 0; i <= 100; i++) {
        $('.progress-bar2').text(i + '%');
        $('.progress-bar2').width(i + '%');
        if (i === 100) {
            $('.progress-bar2').css('background-color', '#79BAEC');
          $('.progress-bar2').html('done');

        }
    }
    // $('.progress-bar2').text('0%');
    // $('.progress-bar2').width('0%');

    // xhr.upload.addEventListener('progress2', function(evt) {
    // }
}
